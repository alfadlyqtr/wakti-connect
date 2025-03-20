
import { PermissionLevel, StaffPermissions } from "./types";
import { normalizePermissions, createDefaultPermissions } from "./staffPermissions";

// Check if user has required permission level for the specified resource
export function hasPermission(
  permissions: StaffPermissions | null | undefined,
  resource: keyof StaffPermissions,
  requiredLevel: PermissionLevel
): boolean {
  if (!permissions) return false;
  
  // Normalize permissions to ensure we have all fields
  const normalizedPermissions = normalizePermissions(permissions);
  
  // Get the actual permission level for the resource
  const userPermissionLevel = normalizedPermissions[resource];
  
  // Admin has access to everything
  if (userPermissionLevel === "admin") return true;
  
  // Read permission
  if (requiredLevel === "read") {
    return userPermissionLevel === "read" || userPermissionLevel === "write";
  }
  
  // Write permission
  if (requiredLevel === "write") {
    return userPermissionLevel === "write";
  }
  
  // None means no permission
  return false;
}

// Check if the user is an admin for the specified resource
export function isAdmin(
  permissions: StaffPermissions | null | undefined,
  resource: keyof StaffPermissions
): boolean {
  if (!permissions) return false;
  
  // Normalize permissions to ensure we have all fields
  const normalizedPermissions = normalizePermissions(permissions);
  
  return normalizedPermissions[resource] === "admin";
}

// Check if user has any permissions for the resource
export function hasAnyPermission(
  permissions: StaffPermissions | null | undefined,
  resource: keyof StaffPermissions
): boolean {
  if (!permissions) return false;
  
  // Normalize permissions to ensure we have all fields
  const normalizedPermissions = normalizePermissions(permissions);
  
  return normalizedPermissions[resource] !== "none";
}
