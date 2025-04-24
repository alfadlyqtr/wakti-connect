
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/user';

export const useEffectiveRole = () => {
  const [effectiveRole, setEffectiveRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setEffectiveRole(null);
          return;
        }

        // Check if super admin
        const { data: superAdmin } = await supabase
          .from('super_admins')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (superAdmin) {
          setEffectiveRole('super-admin');
          return;
        }

        // Check if staff
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', session.user.id)
          .single();

        // Get account type
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();

        // Determine effective role with proper priority
        if (profile?.account_type === 'business') {
          setEffectiveRole('business');
        } else if (staffData) {
          setEffectiveRole('staff');
        } else if (profile?.account_type === 'individual') {
          setEffectiveRole('individual');
        } else {
          setEffectiveRole('individual'); // Default role
        }
      } catch (error) {
        console.error('Error fetching role:', error);
        setEffectiveRole('individual'); // Default role on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchRole();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { effectiveRole, isLoading };
};
