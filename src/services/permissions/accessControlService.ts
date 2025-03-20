import { PermissionLevel, StaffPermissions } from "./types";
import { normalizePermissions, createDefaultPermissions } from "./staffPermissions";
import { supabase } from "@/integrations/supabase/client";

// Export the types that are needed by other modules
export type { PermissionLevel, StaffPermissions } from "./types";

// Define the UserRoleInfo interface for role information
export interface UserRoleInfo {
  role: string;
  businessId?: string;
  permissions?: StaffPermissions;
}

// Get user role information 
export async function getUserRoleInfo(): Promise<UserRoleInfo | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    
    // First try to get business owner status
    const { data: businessData, error: businessError } = await supabase
      .from('profiles')
      .select('id, account_type')
      .eq('id', session.user.id)
      .eq('account_type', 'business')
      .maybeSingle();
      
    if (businessData) {
      return {
        role: 'business',
        businessId: businessData.id
      };
    }
    
    // Check for staff member
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('*')
      .eq('staff_id', session.user.id)
      .maybeSingle();
    
    if (staffData) {
      // Determine if co-admin or regular staff
      const permissions = normalizePermissions(staffData.permissions);
      const isCoAdmin = permissions.staff === 'admin' || permissions.staff_permission === 'admin';
      
      return {
        role: isCoAdmin ? 'co-admin' : 'staff',
        businessId: staffData.business_id,
        permissions
      };
    }
    
    // Check individual plan status
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .maybeSingle();
      
    if (profileData) {
      return {
        role: profileData.account_type as string
      };
    }
    
    // Default to free account
    return {
      role: 'free'
    };
  } catch (error) {
    console.error("Error getting user role info:", error);
    return null;
  }
}

// Function to check permission level
export function meetsPermissionLevel(required: PermissionLevel, userRole: string): boolean {
  // Define role hierarchy
  const rolePriority: Record<string, number> = {
    'business': 100,
    'co-admin': 90,
    'admin': 80,
    'staff': 50,
    'individual': 30,
    'free': 10
  };
  
  const requiredPriority = {
    'admin': 80,
    'write': 50,
    'read': 30,
    'none': 0
  };
  
  const userPriority = rolePriority[userRole] || 0;
  const requiredLevel = requiredPriority[required] || 0;
  
  return userPriority >= requiredLevel;
}

// Get business permissions based on role info
export function getBusinessPermissions(roleInfo: UserRoleInfo | null | unknown): StaffPermissions | null {
  if (!roleInfo) return null;
  
  // Type guard for UserRoleInfo
  const typedRoleInfo = roleInfo as UserRoleInfo;
  
  // If permissions are provided directly, return them
  if (typedRoleInfo.permissions) {
    return typedRoleInfo.permissions;
  }
  
  // Otherwise create permissions based on role
  switch (typedRoleInfo.role) {
    case 'business':
      return createDefaultPermissions('admin');
    case 'co-admin':
      const permissions = createDefaultPermissions('admin');
      permissions.staff = 'write';
      permissions.staff_permission = 'write';
      return permissions;
    case 'admin':
      return createDefaultPermissions('write');
    case 'staff':
      return createDefaultPermissions('write');
    default:
      return createDefaultPermissions('none');
  }
}

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
