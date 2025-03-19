
export type PermissionLevel = 'none' | 'read' | 'write' | 'admin';

export interface StaffPermissions {
  service_permission: PermissionLevel;
  booking_permission: PermissionLevel;
  staff_permission: PermissionLevel;
  analytics_permission: PermissionLevel;
}
