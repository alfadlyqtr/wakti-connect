
export type PermissionLevel = "none" | "read" | "write" | "admin";

export interface StaffPermissions {
  // New fields
  tasks: PermissionLevel;
  events: PermissionLevel;
  messages: PermissionLevel;
  services: PermissionLevel;
  bookings: PermissionLevel;
  staff: PermissionLevel;
  analytics: PermissionLevel;
  
  // Legacy fields for backward compatibility
  service_permission?: PermissionLevel;
  booking_permission?: PermissionLevel;
  staff_permission?: PermissionLevel;
  analytics_permission?: PermissionLevel;
}
