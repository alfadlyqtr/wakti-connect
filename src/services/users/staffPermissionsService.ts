
import { supabase } from "@/integrations/supabase/client";

export const getStaffPermissions = async () => {
  try {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole === 'staff') {
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
