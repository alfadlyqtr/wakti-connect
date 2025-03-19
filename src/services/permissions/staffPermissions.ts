import { PermissionLevel, StaffPermissions } from "./types";

// Helper to convert legacy permission format to new format
export function normalizePermissions(permissions: any): StaffPermissions {
  // If it's already in the new format with all required fields, return it
  if (
    permissions.tasks !== undefined &&
    permissions.events !== undefined &&
    permissions.messages !== undefined &&
    permissions.services !== undefined &&
    permissions.bookings !== undefined &&
    permissions.staff !== undefined &&
    permissions.analytics !== undefined
  ) {
    return permissions as StaffPermissions;
  }

  // Otherwise convert from legacy format
  const normalizedPermissions: StaffPermissions = {
    // Map legacy fields to new fields
    tasks: "none",
    events: "none",
    messages: "none",
    services: permissions.service_permission || "none",
    bookings: permissions.booking_permission || "none",
    staff: permissions.staff_permission || "none",
    analytics: permissions.analytics_permission || "none",
    
    // Keep the legacy fields for backwards compatibility
    service_permission: permissions.service_permission,
    booking_permission: permissions.booking_permission,
    staff_permission: permissions.staff_permission,
    analytics_permission: permissions.analytics_permission
  };

  return normalizedPermissions;
}

// Create default permissions object with both new and legacy fields
export function createDefaultPermissions(level: PermissionLevel = "none"): StaffPermissions {
  return {
    // New fields
    tasks: level,
    events: level,
    messages: level,
    services: level,
    bookings: level,
    staff: level,
    analytics: level,
    
    // Legacy fields
    service_permission: level,
    booking_permission: level,
    staff_permission: level,
    analytics_permission: level
  };
}

// Create admin permissions
export function createAdminPermissions(): StaffPermissions {
  return createDefaultPermissions("admin");
}

// Create standard staff permissions
export function createStaffPermissions(): StaffPermissions {
  const permissions = createDefaultPermissions("write");
  permissions.staff = "none";
  permissions.staff_permission = "none";
  return permissions;
}

import { supabase } from "@/integrations/supabase/client";

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
