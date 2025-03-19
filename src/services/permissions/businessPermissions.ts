import { supabase } from "@/integrations/supabase/client";
import { StaffPermissions, PermissionLevel } from "./types";
import { extractPermissionLevel } from "./permissionUtils";
import { createDefaultPermissions, createAdminPermissions, createStaffPermissions } from "@/services/permissions/staffPermissions";

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
    
    // Specific level checks with proper type handling
    if (requiredLevel === 'read') {
      return ['read', 'write', 'admin'].includes(userLevel as string);
    } else if (requiredLevel === 'write') {
      return ['write', 'admin'].includes(userLevel as string);
    } else if (requiredLevel === 'admin') {
      // For admin level, we need exact match with type assertion
      return userLevel === ('admin' as PermissionLevel);
    }
    
    return userLevel !== 'none';
  } catch (error) {
    console.error("Error checking business permission:", error);
    return false;
  }
};

export const getDefaultPermissions = (role: string) => {
  switch (role) {
    case "admin":
    case "co-admin":
      return createAdminPermissions();
    case "staff":
      return createStaffPermissions();
    default:
      return createDefaultPermissions("none");
  }
};
