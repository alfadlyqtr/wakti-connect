
import { supabase } from "@/integrations/supabase/client";

export const getStaffPermissions = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return {
        isStaff: false,
        canEditProfile: false,
        canEditTheme: true,
        canEditBasicInfo: false,
        loading: false
      };
    }
    
    // Check if the user is a staff member
    const { data: staffData } = await supabase
      .from('business_staff')
      .select('*')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .single();
    
    if (staffData) {
      return {
        isStaff: true,
        canEditProfile: false,
        canEditTheme: true,
        canEditBasicInfo: false,
        loading: false
      };
    }
    
    return {
      isStaff: false,
      canEditProfile: true,
      canEditTheme: true,
      canEditBasicInfo: true,
      loading: false
    };
  } catch (error) {
    console.error("Error checking staff permissions:", error);
    return {
      isStaff: false,
      canEditProfile: false,
      canEditTheme: true,
      canEditBasicInfo: false,
      loading: false
    };
  }
};
