
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Define a more specific type for UserRole
export type UserRole = 'individual' | 'business' | 'staff' | 'free' | 'super-admin';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setUserRole(null);
          setIsLoading(false);
          return;
        }
        
        // First check if user is a super-admin
        const { data: superAdminData, error: superAdminError } = await supabase
          .from('super_admins')
          .select('id')
          .eq('id', session.user.id)
          .single();
          
        if (superAdminData && !superAdminError) {
          setUserRole('super-admin');
          setIsLoading(false);
          return;
        }
        
        const { data: userData, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        } else {
          // Cast to UserRole type for safety, defaulting to 'free' if null
          const role = userData?.role as UserRole || 'free';
          setUserRole(role);
        }
      } catch (error) {
        console.error("Error in getUserRole:", error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserRole();
  }, []);

  return { userRole, isLoading };
};
