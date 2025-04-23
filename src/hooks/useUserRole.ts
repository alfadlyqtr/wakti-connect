
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/user';

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
        
        const { data: userData, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        } else {
          setUserRole(userData?.role || 'free');
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
