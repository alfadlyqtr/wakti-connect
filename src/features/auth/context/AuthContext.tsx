
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppUser, User as AppUserType } from '@/features/auth/types';
import { UserRole } from '@/types/roles';
import { getEffectiveRole } from '@/types/roles';
import { useAuthState } from '../hooks/useAuthState';
import { useAuthOperations } from '../hooks/useAuthOperations';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, isLoading, setIsLoading } = useAuthState();
  const [effectiveRole, setEffectiveRole] = useState<UserRole | null>(null);
  const [isInitializingRole, setIsInitializingRole] = useState<boolean>(true);
  const [session, setSession] = useState<any>(null);
  
  const { login, logout, register } = useAuthOperations(setUser as React.Dispatch<React.SetStateAction<AppUserType | null>>, setIsLoading);

  // Fetch and initialize user role
  useEffect(() => {
    if (!isLoading && user) {
      fetchUserRoleData(user.id);
    } else if (!isLoading && !user) {
      setEffectiveRole(null);
      setIsInitializingRole(false);
    }
  }, [user, isLoading]);

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

  // Helper function to refresh the user's role
  const refreshUserRole = async () => {
    if (user) {
      await fetchUserRoleData(user.id);
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
        isAuthenticated: !!user,
        isLoading: finalLoadingState,
        user,
        session,
        effectiveRole,
        hasRole,
        hasAccess,
        login,
        logout,
        register,
        refreshUserRole
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
