
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/roles";

export interface DashboardUserProfile {
  profileData: {
    account_type: "individual" | "business";
    display_name: string | null;
    business_name: string | null;
    full_name: string | null;
    theme_preference: string | null;
  } | null;
  isLoading: boolean;
  userId: string | null;
  isStaff: boolean;
  userRole: UserRole;
  isSuperAdmin: boolean;
}

export const getDashboardUserProfile = async (): Promise<DashboardUserProfile> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return {
        profileData: null,
        isLoading: false,
        userId: null,
        isStaff: false,
        userRole: 'individual',
        isSuperAdmin: false
      };
    }
    
    // Check if super admin
    const { data: isSuperAdminResult } = await supabase.rpc('is_super_admin');
    
    if (isSuperAdminResult) {
      return {
        profileData: {
          account_type: 'business',
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

    // Convert legacy or invalid account types to 'individual'
    const accountType = (profileData?.account_type === 'business') ? 'business' : 'individual';

    return {
      profileData: {
        ...profileData,
        account_type: accountType
      },
      isLoading: false,
      userId: session.user.id,
      isStaff: !!staffData,
      userRole: staffData ? 'staff' : accountType,
      isSuperAdmin: false
    };
  } catch (error) {
    console.error('Error fetching dashboard profile:', error);
    return {
      profileData: null,
      isLoading: false,
      userId: null,
      isStaff: false,
      userRole: 'individual',
      isSuperAdmin: false
    };
  }
};

// Add the missing getUserProfile function
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
