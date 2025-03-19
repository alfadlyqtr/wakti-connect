
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

export const getStaffPermissions = async (staffId: string): Promise<StaffPermissions> => {
  try {
    const { data, error } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('staff_id', staffId)
      .maybeSingle();
      
    if (error) throw error;
    
    // If permissions is null, return default permissions
    if (!data || !data.permissions) return getDefaultPermissions();
    
    return data.permissions as StaffPermissions;
  } catch (error) {
    console.error("Error fetching staff permissions:", error);
    return getDefaultPermissions();
  }
};

export const getStaffRelationPermissions = async (relationId: string): Promise<StaffPermissions> => {
  try {
    const { data, error } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('id', relationId)
      .maybeSingle();
      
    if (error) throw error;
    
    // If permissions is null, return default permissions
    if (!data || !data.permissions) return getDefaultPermissions();
    
    return data.permissions as StaffPermissions;
  } catch (error) {
    console.error("Error fetching staff relation permissions:", error);
    return getDefaultPermissions();
  }
};

export const updateStaffPermissions = async (
  staffId: string, 
  permissions: Partial<StaffPermissions>
): Promise<boolean> => {
  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('id', staffId)
      .maybeSingle();
      
    if (fetchError) throw fetchError;
    
    const currentPermissions = currentData?.permissions || getDefaultPermissions();
    const updatedPermissions = { ...currentPermissions, ...permissions };
    
    const { error: updateError } = await supabase
      .from('business_staff')
      .update({ permissions: updatedPermissions })
      .eq('id', staffId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error("Error updating staff permissions:", error);
    return false;
  }
};

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

export const isServiceProvider = async (staffId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('business_staff')
      .select('is_service_provider')
      .eq('staff_id', staffId)
      .maybeSingle();
      
    if (error) throw error;
    
    return !!data?.is_service_provider;
  } catch (error) {
    console.error("Error checking if staff is service provider:", error);
    return false;
  }
};
