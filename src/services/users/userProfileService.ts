
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
        profileData: {
          account_type: 'super-admin',
          display_name: 'System Administrator',
          business_name: 'WAKTI Administration',
          full_name: 'System Administrator',
          theme_preference: 'dark'
        },
        isLoading: false,
        userId: session.user.id,
        isStaff: false,
        userRole: 'super-admin',
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
      profileData: {
        ...profileData,
      },
      isLoading: false,
      userId: session.user.id,
      isStaff: !!staffData,
      userRole: staffData ? 'staff' : profileData.account_type,
      isSuperAdmin: false
    };
  } catch (error) {
    console.error('Error fetching dashboard profile:', error);
    return {
      profileData: null,
      isLoading: false,
      userId: null,
      isStaff: false,
      userRole: 'free',
      isSuperAdmin: false
    };
  }
};
