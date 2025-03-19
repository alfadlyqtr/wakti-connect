
import { StaffPermissions, PermissionLevel, BusinessPermissionsState } from "./types";
import { normalizeStaffPermissions, getDefaultStaffPermissions } from "./staffPermissions";

// Check if a user has the required permission level
export function meetsPermissionLevel(required: PermissionLevel, actual: PermissionLevel): boolean {
  const levels: Record<PermissionLevel, number> = {
    "admin": 3,
    "write": 2,
    "read": 1,
    "none": 0
  };
  
  return levels[actual] >= levels[required];
}

// Get business permissions based on role and permission levels
export function getBusinessPermissions(roleInfo: any): BusinessPermissionsState {
  if (!roleInfo) {
    return {
      canCreateServices: false,
      canEditServices: false,
      canDeleteServices: false,
      canAssignStaff: false,
      canCreateBookings: false,
      canEditBookings: false,
      canCancelBookings: false,
      canManageStaff: false,
      canViewAnalytics: false
    };
  }
  
  const permissions = normalizeStaffPermissions(roleInfo.permissions || {});
  const role = roleInfo.role || "staff";
  
  // Business owners and admins have full permissions
  if (role === "business" || role === "admin" || role === "co-admin") {
    return {
      canCreateServices: true,
      canEditServices: true,
      canDeleteServices: true,
      canAssignStaff: true,
      canCreateBookings: true,
      canEditBookings: true,
      canCancelBookings: true,
      canManageStaff: true,
      canViewAnalytics: true
    };
  }
  
  // For staff members, check specific permissions
  return {
    canCreateServices: meetsPermissionLevel("write", permissions.services),
    canEditServices: meetsPermissionLevel("write", permissions.services),
    canDeleteServices: meetsPermissionLevel("admin", permissions.services),
    canAssignStaff: meetsPermissionLevel("write", permissions.services),
    canCreateBookings: meetsPermissionLevel("write", permissions.bookings),
    canEditBookings: meetsPermissionLevel("write", permissions.bookings),
    canCancelBookings: meetsPermissionLevel("write", permissions.bookings),
    canManageStaff: meetsPermissionLevel("write", permissions.staff),
    canViewAnalytics: meetsPermissionLevel("read", permissions.analytics)
  };
}

// Get user role info - simulate API call for now
export async function getUserRoleInfo(): Promise<any> {
  // This would typically be a call to your API or database
  // For now, return a mock object
  return {
    role: "staff",
    permissions: getDefaultStaffPermissions(),
    businessId: "some-business-id"
  };
}

export { type PermissionLevel, type StaffPermissions, type BusinessPermissionsState };
