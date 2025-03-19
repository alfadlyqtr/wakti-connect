
import { supabase } from "@/integrations/supabase/client";
import { StaffPermissions } from "./types";

// Update staff permissions
export const updateStaffPermissions = async (
  staffId: string,
  permissions: StaffPermissions
): Promise<boolean> => {
  try {
    // Convert StaffPermissions to a plain object that Supabase can handle as JSON
    const permissionsJson = {
      service_permission: permissions.service_permission,
      booking_permission: permissions.booking_permission,
      staff_permission: permissions.staff_permission,
      analytics_permission: permissions.analytics_permission
    };
    
    const { error } = await supabase
      .from('business_staff')
      .update({ permissions: permissionsJson })
      .eq('id', staffId);
    
    if (error) {
      console.error("Error updating staff permissions:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateStaffPermissions:", error);
    return false;
  }
};
