
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser, AuthContextType } from "../../domain/types";
import { authService } from "../../domain/services/authService";
import { UserRole } from "@/types/roles";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [effectiveRole, setEffectiveRole] = useState<UserRole | null>(null);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    const setupAuthListener = () => {
      const { subscription } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (!isMounted) return;
        
        console.log("Auth state changed:", event, currentSession?.user?.id || "no user");
        
        if (currentSession?.user) {
          setUser(currentSession.user as unknown as AuthUser);
          setSession(currentSession);
          
          // Get the effective role
          const role = await authService.getEffectiveRole(
            currentSession.user.id, 
            (currentSession.user as any).account_type
          );
          setEffectiveRole(role);
        } else {
          setUser(null);
          setSession(null);
          setEffectiveRole(null);
        }
        
        setIsLoading(false);
      });
      
      return subscription;
    };
    
    const checkSession = async () => {
      try {
        const { user, session, error } = await authService.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        }
        
        if (user && session) {
          setUser(user);
          setSession(session);
          
          // Get the effective role
          const role = await authService.getEffectiveRole(user.id, user.account_type);
          setEffectiveRole(role);
        }
        
      } catch (error) {
        console.error("Unexpected error checking session:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Set up auth listener first
    const subscription = setupAuthListener();
    
    // Then check existing session
    checkSession();
    
    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Helper to refresh the user's role
  const refreshUserRole = async (): Promise<void> => {
    if (user) {
      const role = await authService.getEffectiveRole(user.id, user.account_type);
      setEffectiveRole(role);
    }
  };

  // Login method
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: authUser, error } = await authService.login(email, password);
      return { error, data: authUser };
    } catch (error: any) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register method
  const register = async (
    email: string,
    password: string,
    name?: string,
    accountType: string = 'individual',
    businessName?: string
  ) => {
    setIsLoading(true);
    try {
      const { user: authUser, error } = await authService.register(
        email, 
        password, 
        name, 
        accountType, 
        businessName
      );
      return { error, data: authUser };
    } catch (error: any) {
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole) => {
    return authService.hasRole(user, role);
  };

  // Check if user has access based on required roles
  const hasAccess = (requiredRoles: UserRole[]) => {
    return authService.hasAccess(user, requiredRoles);
  };

  // Calculate auth-related derived state
  const userId = user?.id || null;
  const userRole = effectiveRole || 'individual';
  const isAuthenticated = !!user;
  const isStaff = userRole === 'staff';
  const isSuperAdmin = userRole === 'superadmin';
  const business_name = user?.business_name;
  const theme_preference = user?.theme_preference;

  const value: AuthContextType = {
    user,
    session,
    effectiveRole,
    isAuthenticated,
    isLoading,
    userId,
    userRole,
    isStaff,
    isSuperAdmin,
    business_name,
    theme_preference,
    hasRole,
    hasAccess,
    login,
    logout,
    register,
    refreshUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

// Export the context for direct usage (if needed)
export { AuthContext };
