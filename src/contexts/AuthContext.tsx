
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole, getEffectiveRole } from "@/types/roles";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  effectiveRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<{
    error: Error | null;
    data?: any;
  }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    name?: string,
    accountType?: string,
    businessName?: string
  ) => Promise<{
    error: Error | null;
    data?: any;
  }>;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [effectiveRole, setEffectiveRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Unified method to determine user role
  const determineUserRole = useCallback(async (userId: string) => {
    try {
      // Check if user is a super admin
      const { data: superAdminData } = await supabase
        .from('super_admins')
        .select('id')
        .eq('id', userId)
        .single();
      
      const isSuperAdmin = !!superAdminData;
      setIsSuperAdmin(isSuperAdmin);

      // Check if user is staff
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('id')
        .eq('staff_id', userId)
        .single();
      
      const isStaff = !!staffData;
      setIsStaff(isStaff);

      // Get account type
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', userId)
        .single();

      // Calculate effective role
      const role = getEffectiveRole(
        profile?.account_type, 
        isStaff, 
        isSuperAdmin
      );
      
      // Cache role in localStorage for quicker access
      localStorage.setItem('userRole', role);
      localStorage.setItem('isStaff', isStaff ? 'true' : 'false');
      localStorage.setItem('isSuperAdmin', isSuperAdmin ? 'true' : 'false');
      
      return role;
    } catch (error) {
      console.error("Error determining user role:", error);
      // Default to most restrictive role
      return 'individual';
    }
  }, []);

  // Refresh user role (useful after account type changes)
  const refreshUserRole = useCallback(async () => {
    if (user) {
      const role = await determineUserRole(user.id);
      setEffectiveRole(role);
    }
  }, [user, determineUserRole]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log("Auth state changed:", event);
            setSession(newSession);
            
            if (newSession?.user) {
              setUser(newSession.user);
              const role = await determineUserRole(newSession.user.id);
              setEffectiveRole(role);
            } else {
              setUser(null);
              setEffectiveRole(null);
              localStorage.removeItem('userRole');
              localStorage.removeItem('isStaff');
              localStorage.removeItem('isSuperAdmin');
            }
          }
        );
        
        // Get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          const role = await determineUserRole(currentSession.user.id);
          setEffectiveRole(role);
        } else {
          setUser(null);
          setEffectiveRole(null);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [determineUserRole]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null, data };
    } catch (error: any) {
      console.error('Login error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear role data from localStorage
      localStorage.removeItem('userRole');
      localStorage.removeItem('isStaff');
      localStorage.removeItem('isSuperAdmin');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    email: string, 
    password: string, 
    name?: string, 
    accountType: string = 'individual', 
    businessName?: string
  ) => {
    try {
      setIsLoading(true);
      
      // Calculate trial end date (3 days from now)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 3);
      
      // Prepare metadata
      const metadata: Record<string, any> = {
        full_name: name || '',
        account_type: accountType,
        trial_ends_at: trialEndDate.toISOString()
      };
      
      if (businessName && accountType === 'business') {
        metadata.business_name = businessName;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin + '/auth/login'
        }
      });

      if (error) throw error;
      
      return { error: null, data };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Role checking utilities
  const hasRole = useCallback((role: UserRole): boolean => {
    if (!effectiveRole) return false;
    
    // When checking roles, consider the role hierarchy
    if (effectiveRole === 'super-admin') return true;
    if (effectiveRole === 'business' && role !== 'super-admin') return true;
    if (effectiveRole === 'staff' && (role === 'staff' || role === 'individual')) return true;
    if (effectiveRole === 'individual' && role === 'individual') return true;
    
    return effectiveRole === role;
  }, [effectiveRole]);

  const hasAccess = useCallback((requiredRoles: UserRole[]): boolean => {
    if (!effectiveRole) return false;
    if (requiredRoles.length === 0) return true;
    
    // Check if effectiveRole is in the allowed roles
    return requiredRoles.some(role => hasRole(role));
  }, [effectiveRole, hasRole]);

  // Provide the auth context value
  const value: AuthContextType = {
    user,
    session,
    effectiveRole,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    hasAccess,
    login,
    logout,
    register,
    refreshUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Role-specific hook for easier checking
export const useRole = () => {
  const { effectiveRole, hasRole, hasAccess } = useAuth();
  return { userRole: effectiveRole, hasRole, hasAccess };
};

// Helper hooks for common role checks
export const useIsBusinessOwner = () => {
  const { hasRole } = useAuth();
  return hasRole('business');
};

export const useIsStaff = () => {
  const { hasRole } = useAuth();
  return hasRole('staff');
};

export const useIsSuperAdmin = () => {
  const { hasRole } = useAuth();
  return hasRole('super-admin');
};
