
import { supabase } from "@/integrations/supabase/client";

export interface StaffPermissions {
  can_track_hours: boolean;
  can_message_staff: boolean;
  can_create_job_cards: boolean;
  can_view_own_analytics: boolean;
}

export const getDefaultPermissions = (): StaffPermissions => ({
  can_track_hours: true,
  can_message_staff: true,
  can_create_job_cards: true,
  can_view_own_analytics: true
});

/**
 * Gets permissions for a staff member by staff user ID
 */
export const getStaffPermissions = async (staffId: string): Promise<StaffPermissions> => {
  try {
    const { data, error } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('staff_id', staffId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching staff permissions:", error);
      return getDefaultPermissions();
    }
    
    // If permissions is null, return default permissions
    if (!data || !data.permissions) return getDefaultPermissions();
    
    // Handle the data.permissions properly, ensure it's the correct type
    if (typeof data.permissions === 'object' && data.permissions !== null) {
      return {
        ...getDefaultPermissions(),
        ...data.permissions as StaffPermissions
      };
    }
    
    return getDefaultPermissions();
  } catch (error) {
    console.error("Error fetching staff permissions:", error);
    return getDefaultPermissions();
  }
};

/**
 * Gets permissions for a staff relation by relation ID
 */
export const getStaffRelationPermissions = async (relationId: string): Promise<StaffPermissions> => {
  try {
    const { data, error } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('id', relationId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching staff relation permissions:", error);
      return getDefaultPermissions();
    }
    
    // If permissions is null, return default permissions
    if (!data || !data.permissions) return getDefaultPermissions();
    
    // Handle the data.permissions properly, ensure it's the correct type
    if (typeof data.permissions === 'object' && data.permissions !== null) {
      return {
        ...getDefaultPermissions(),
        ...data.permissions as StaffPermissions
      };
    }
    
    return getDefaultPermissions();
  } catch (error) {
    console.error("Error fetching staff relation permissions:", error);
    return getDefaultPermissions();
  }
};

/**
 * Updates permissions for a staff member by staff relation ID
 */
export const updateStaffPermissions = async (
  staffId: string, 
  permissions: Partial<StaffPermissions>
): Promise<boolean> => {
  try {
    // First, get current permissions
    const { data: currentData, error: fetchError } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('id', staffId)
      .maybeSingle();
      
    if (fetchError) {
      console.error("Error fetching current permissions:", fetchError);
      return false;
    }
    
    // Handle different types of currentData.permissions
    let currentPermissions: StaffPermissions;
    
    if (!currentData?.permissions) {
      currentPermissions = getDefaultPermissions();
    } else if (typeof currentData.permissions === 'object' && currentData.permissions !== null) {
      currentPermissions = {
        ...getDefaultPermissions(),
        ...(currentData.permissions as object) as StaffPermissions
      };
    } else {
      currentPermissions = getDefaultPermissions();
    }
    
    const updatedPermissions = { ...currentPermissions, ...permissions };
    
    // Update with merged permissions
    const { error: updateError } = await supabase
      .from('business_staff')
      .update({ permissions: updatedPermissions })
      .eq('id', staffId);
      
    if (updateError) {
      console.error("Error updating staff permissions:", updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating staff permissions:", error);
    return false;
  }
};

/**
 * Checks if a staff member has a specific permission
 */
export const checkStaffPermission = async (
  staffId: string, 
  permission: keyof StaffPermissions
): Promise<boolean> => {
  try {
    const permissions = await getStaffPermissions(staffId);
    return !!permissions[permission];
  } catch (error) {
    console.error(`Error checking staff permission (${permission}):`, error);
    return false;
  }
};

/**
 * Checks if a staff member is a service provider
 */
export const isServiceProvider = async (staffId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('business_staff')
      .select('is_service_provider')
      .eq('staff_id', staffId)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking if staff is service provider:", error);
      return false;
    }
    
    return !!data?.is_service_provider;
  } catch (error) {
    console.error("Error checking if staff is service provider:", error);
    return false;
  }
};
