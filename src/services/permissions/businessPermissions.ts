
import { PermissionLevel, StaffPermissions } from "./types";
import { createDefaultPermissions, createAdminPermissions, createStaffPermissions } from "./staffPermissions";

/**
 * Get admin permissions for a business owner
 */
export function getBusinessOwnerPermissions(): StaffPermissions {
  return createAdminPermissions();
}

/**
 * Get co-admin permissions
 */
export function getCoAdminPermissions(): StaffPermissions {
  const permissions = createAdminPermissions();
  
  // Co-admins have restricted access to certain staff functions
  permissions.staff = "write";
  permissions.staff_permission = "write";
  
  return permissions;
}

/**
 * Get default staff permissions
 */
export function getDefaultStaffPermissions(): StaffPermissions {
  return createStaffPermissions();
}

/**
 * Get no permissions (for disabled accounts or initial state)
 */
export function getNoPermissions(): StaffPermissions {
  return createDefaultPermissions("none");
}

/**
 * Get admin level permissions for system administrators
 */
export function getSystemAdminPermissions(): StaffPermissions {
  return createAdminPermissions();
}

/**
 * Get admin level permissions for business administrator
 */
export function getBusinessAdminPermissions(): StaffPermissions {
  return createAdminPermissions();
}

/**
 * Create custom permissions based on specified levels
 */
export function createCustomPermissions(
  servicePermission: PermissionLevel,
  bookingPermission: PermissionLevel,
  staffPermission: PermissionLevel,
  analyticsPermission: PermissionLevel
): StaffPermissions {
  const permissions = createDefaultPermissions();
  
  // Set both new and legacy fields
  permissions.services = servicePermission;
  permissions.service_permission = servicePermission;
  
  permissions.bookings = bookingPermission;
  permissions.booking_permission = bookingPermission;
  
  permissions.staff = staffPermission;
  permissions.staff_permission = staffPermission;
  
  permissions.analytics = analyticsPermission;
  permissions.analytics_permission = analyticsPermission;
  
  return permissions;
}
