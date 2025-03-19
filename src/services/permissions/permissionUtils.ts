
import { PermissionLevel } from "./types";

// Helper function to ensure we have a valid permission level
export function extractPermissionLevel(value: unknown): PermissionLevel {
  if (value === 'admin' || value === 'write' || value === 'read') {
    return value;
  }
  return 'none';
}

// Helper to check if a permission level meets a required level
export function meetsPermissionLevel(
  userLevel: PermissionLevel, 
  requiredLevel: PermissionLevel
): boolean {
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
}
