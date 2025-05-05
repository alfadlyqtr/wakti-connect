
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/features/auth/types';
import { UserRole } from '@/types/roles';
import { getEffectiveRole } from '@/types/roles';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  effectiveRole: UserRole | null;
  hasRole: (role: UserRole) => boolean;
  hasAccess: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [effectiveRole, setEffectiveRole] = useState<UserRole | null>(null);
  const [isInitializingRole, setIsInitializingRole] = useState<boolean>(true);

  // Initialize auth state and set up listener
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            const isAuthed = !!session?.user;
            setIsAuthenticated(isAuthed);
            setUser(session?.user || null);
            
            // If user logged out, reset role
            if (!isAuthed) {
              setEffectiveRole(null);
              setIsInitializingRole(false);
              return;
            }
            
            // Only fetch role data if auth status changed to authenticated
            if (isAuthed) {
              await fetchUserRoleData(session.user.id);
            }
          }
        );

        // Check current session status
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserRoleData(session.user.id);
        } else {
          setIsInitializingRole(false);
        }
        
        setIsLoading(false);
        
        return () => {
          authListener?.subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
        setIsInitializingRole(false);
      }
    };

    initializeAuth();
  }, []);

  // Function to fetch user role data with retry logic
  const fetchUserRoleData = async (userId: string) => {
    setIsInitializingRole(true);
    let retries = 3;
    
    while (retries > 0) {
      try {
        // Get account type from profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', userId)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        // Check if user is staff
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', userId)
          .eq('status', 'active')
          .maybeSingle();
          
        // Check if super admin
        const { data: adminData } = await supabase
          .from('super_admins')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        // Set the effective role
        const accountType = profileData?.account_type;
        const isStaff = !!staffData;
        const isSuperAdmin = !!adminData;
        
        const role = getEffectiveRole(accountType, isStaff, isSuperAdmin);
        console.log("Determined user role:", role, { accountType, isStaff, isSuperAdmin });
        
        setEffectiveRole(role);
        localStorage.setItem('userRole', role);
        setIsInitializingRole(false);
        return;
      } catch (error) {
        console.error('Error fetching role data:', error);
        retries--;
        
        if (retries === 0) {
          // If all retries failed, try to use cached role from localStorage
          const cachedRole = localStorage.getItem('userRole') as UserRole | null;
          if (cachedRole) {
            console.log("Using cached role:", cachedRole);
            setEffectiveRole(cachedRole);
          }
          setIsInitializingRole(false);
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
  };

  // Helper function to check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    if (!effectiveRole) return false;
    return effectiveRole === role;
  };

  // Helper function to check if user has any of the allowed roles
  const hasAccess = (allowedRoles: UserRole[]): boolean => {
    if (!effectiveRole) return false;
    return allowedRoles.includes(effectiveRole);
  };

  // Final loading state combines initial auth loading and role initialization
  const finalLoadingState = isLoading || isInitializingRole;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading: finalLoadingState,
        user,
        effectiveRole,
        hasRole,
        hasAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
