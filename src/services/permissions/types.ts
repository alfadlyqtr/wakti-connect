
export type PermissionLevel = "admin" | "write" | "read" | "none";

export interface StaffPermissions {
  tasks: PermissionLevel;
  events: PermissionLevel;
  messages: PermissionLevel;
  services: PermissionLevel;
  bookings: PermissionLevel;
  staff: PermissionLevel;
  analytics: PermissionLevel;
  service_permission?: PermissionLevel; // For backward compatibility
  booking_permission?: PermissionLevel; // For backward compatibility
  staff_permission?: PermissionLevel; // For backward compatibility
  analytics_permission?: PermissionLevel; // For backward compatibility
}

export interface BusinessPermissionsState {
  canCreateServices: boolean;
  canEditServices: boolean;
  canDeleteServices: boolean;
  canAssignStaff: boolean;
  canCreateBookings: boolean;
  canEditBookings: boolean;
  canCancelBookings: boolean;
  canManageStaff: boolean;
  canViewAnalytics: boolean;
}
