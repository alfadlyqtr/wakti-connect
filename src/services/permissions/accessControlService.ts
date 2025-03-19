
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
      .select('role, permissions')
      .eq('business_id', businessId)
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error fetching business permissions:", error);
      return null;
    }
    
    // Initialize with default permissions (none)
    const defaultPermissions: StaffPermissions = {
      service_permission: 'none',
      booking_permission: 'none',
      staff_permission: 'none',
      analytics_permission: 'none'
    };
    
    // If role is co-admin, set all permissions to admin
    if (data.role === 'co-admin') {
      return {
        service_permission: 'admin',
        booking_permission: 'admin',
        staff_permission: 'admin',
        analytics_permission: 'admin'
      };
    }
    
    // If role is admin, set some permissions to admin
    if (data.role === 'admin') {
      return {
        service_permission: 'admin',
        booking_permission: 'admin',
        staff_permission: 'write',
        analytics_permission: 'admin'
      };
    }
    
    // If permissions exist in the database as a JSON object, extract them
    if (data.permissions && typeof data.permissions === 'object') {
      const perms = data.permissions as Record<string, any>;
      
      return {
        service_permission: extractPermissionLevel(perms.service_permission),
        booking_permission: extractPermissionLevel(perms.booking_permission),
        staff_permission: extractPermissionLevel(perms.staff_permission),
        analytics_permission: extractPermissionLevel(perms.analytics_permission)
      };
    }
    
    return defaultPermissions;
  } catch (error) {
    console.error("Error in getBusinessPermissions:", error);
    return null;
  }
};

// Helper function to ensure we have a valid permission level
function extractPermissionLevel(value: any): PermissionLevel {
  if (value === 'admin' || value === 'write' || value === 'read') {
    return value;
  }
  return 'none';
}

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
    
    // Get permissions
    const permissions = await getBusinessPermissions(businessId);
    if (!permissions) return false;
    
    const userLevel = permissions[permissionType];
    
    // Admin has all permissions
    if (userLevel === 'admin') return true;
    
    // Specific level checks
    if (requiredLevel === 'read') {
      return ['read', 'write', 'admin'].includes(userLevel);
    } else if (requiredLevel === 'write') {
      return ['write', 'admin'].includes(userLevel);
    } else if (requiredLevel === 'admin') {
      return userLevel === 'admin';
    }
    
    return userLevel !== 'none';
  } catch (error) {
    console.error("Error checking business permission:", error);
    return false;
  }
};

// Get role information from business_staff
export const getUserRoleInfo = async (): Promise<{ 
  role: string; 
  businessId?: string;
} | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('role, business_id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      console.error("Error fetching user role info:", error);
      return null;
    }
    
    return {
      role: data[0].role,
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
