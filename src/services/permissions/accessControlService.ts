import { supabase } from "@/integrations/supabase/client";

export type PermissionLevel = 'none' | 'read' | 'write' | 'admin';

export interface StaffPermissions {
  service_permission: PermissionLevel;
  booking_permission: PermissionLevel;
  staff_permission: PermissionLevel;
  analytics_permission: PermissionLevel;
}

// Get all permissions for the current user in a specific business
export const getBusinessPermissions = async (businessId: string): Promise<StaffPermissions | null> => {
  try {
    // First check if user is the business owner
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    if (user.id === businessId) {
      // Business owner has all permissions
      return {
        service_permission: 'admin',
        booking_permission: 'admin',
        staff_permission: 'admin',
        analytics_permission: 'admin'
      };
    }
    
    // Get staff permissions
    const { data, error } = await supabase
      .from('business_staff')
      .select('service_permission, booking_permission, staff_permission, analytics_permission')
      .eq('business_id', businessId)
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error fetching business permissions:", error);
      return null;
    }
    
    return data as StaffPermissions;
  } catch (error) {
    console.error("Error in getBusinessPermissions:", error);
    return null;
  }
};

// Check if user has a specific permission level for a business
export const hasBusinessPermission = async (
  businessId: string, 
  permissionType: keyof StaffPermissions, 
  requiredLevel: PermissionLevel
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // Business owner has all permissions
    if (user.id === businessId) return true;
    
    // Otherwise check staff permissions
    const { data } = await supabase.rpc('has_business_permission', {
      business_uuid: businessId,
      permission_type: permissionType.replace('_permission', ''),
      required_level: requiredLevel
    });
    
    return !!data;
  } catch (error) {
    console.error("Error checking business permission:", error);
    return false;
  }
};

// Get role information from access_control_manager
export const getUserRoleInfo = async (): Promise<{ 
  role: string; 
  roleLevel: number;
  businessId?: string;
} | null> => {
  try {
    const { data, error } = await supabase
      .from('access_control_manager')
      .select('role, role_level, business_id')
      .order('role_level', { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      console.error("Error fetching user role info:", error);
      return null;
    }
    
    return {
      role: data[0].role,
      roleLevel: data[0].role_level,
      businessId: data[0].business_id
    };
  } catch (error) {
    console.error("Error in getUserRoleInfo:", error);
    return null;
  }
};

// Update staff permissions
export const updateStaffPermissions = async (
  staffId: string,
  permissions: Partial<StaffPermissions>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('business_staff')
      .update(permissions)
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
