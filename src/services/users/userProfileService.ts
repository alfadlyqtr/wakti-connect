
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const getDashboardUserProfile = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }
    
    // Check if super admin
    const { data: isSuperAdminResult } = await supabase.rpc('is_super_admin');
    
    if (isSuperAdminResult) {
      return {
        account_type: 'super-admin',
        isStaff: false,
        isSuperAdmin: true
      };
    }

    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (error) throw error;
    
    // Check staff status
    const { data: staffData } = await supabase
      .from('business_staff')
      .select('*')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .single();

    return {
      ...profileData,
      isStaff: !!staffData,
      isSuperAdmin: false
    };
  } catch (error) {
    console.error('Error fetching dashboard profile:', error);
    return null;
  }
};
