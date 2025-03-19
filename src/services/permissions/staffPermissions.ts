import { PermissionLevel, StaffPermissions } from "./types";

// This function migrates old permission property names to new ones
export function normalizeStaffPermissions(permissions: any): StaffPermissions {
  const normalized: StaffPermissions = {
    tasks: permissions.tasks || "none",
    events: permissions.events || "none",
    messages: permissions.messages || "none",
    services: permissions.services || permissions.service_permission || "none",
    bookings: permissions.bookings || permissions.booking_permission || "none",
    staff: permissions.staff || permissions.staff_permission || "none",
    analytics: permissions.analytics || permissions.analytics_permission || "none"
  };
  
  // Preserve backward compatibility by keeping old property names
  if (permissions.service_permission) {
    normalized.service_permission = permissions.service_permission;
  }
  
  if (permissions.booking_permission) {
    normalized.booking_permission = permissions.booking_permission;
  }
  
  if (permissions.staff_permission) {
    normalized.staff_permission = permissions.staff_permission;
  }
  
  if (permissions.analytics_permission) {
    normalized.analytics_permission = permissions.analytics_permission;
  }
  
  return normalized;
}

// This function migrates new permission property names to old ones for API calls
export function legacyStaffPermissions(permissions: StaffPermissions): any {
  return {
    tasks: permissions.tasks,
    events: permissions.events,
    messages: permissions.messages,
    services: permissions.services,
    bookings: permissions.bookings,
    staff: permissions.staff,
    analytics: permissions.analytics,
    service_permission: permissions.services,
    booking_permission: permissions.bookings,
    staff_permission: permissions.staff,
    analytics_permission: permissions.analytics
  };
}

export function getDefaultStaffPermissions(): StaffPermissions {
  return {
    tasks: "none" as PermissionLevel,
    events: "none" as PermissionLevel,
    messages: "none" as PermissionLevel,
    services: "none" as PermissionLevel,
    bookings: "none" as PermissionLevel,
    staff: "none" as PermissionLevel,
    analytics: "none" as PermissionLevel,
    service_permission: "none" as PermissionLevel,
    booking_permission: "none" as PermissionLevel,
    staff_permission: "none" as PermissionLevel,
    analytics_permission: "none" as PermissionLevel
  };
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
