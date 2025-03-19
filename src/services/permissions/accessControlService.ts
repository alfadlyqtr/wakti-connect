
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "free" | "individual" | "business" | "staff" | "admin" | "co-admin";

export enum PermissionLevel {
  NONE = 0,
  VIEW = 1,
  EDIT = 2,
  MANAGE = 3,
  ADMIN = 4
}

export interface StaffPermissions {
  canManageStaff: boolean;
  canManageServices: boolean;
  canViewAnalytics: boolean;
  canManageBookings: boolean;
}

export interface UserRoleInfo {
  role: UserRole;
  businessId?: string;
  permissions?: StaffPermissions;
}

export async function getUserRoleInfo(): Promise<UserRoleInfo | null> {
  try {
    // Check if there's a valid session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No active session - can't get user role");
      return null;
    }
    
    // First try the RPC function to get the user role
    const { data: userRole, error: roleError } = await supabase.rpc('get_user_role');
    
    if (roleError) {
      console.error("Error getting user role:", roleError);
      return null;
    }
    
    // Type assertion to make TypeScript happy
    const role = userRole as UserRole;
    console.log("User role from RPC:", role);
    
    let businessId: string | undefined;
    let permissions: StaffPermissions | undefined;
    
    // Get business ID for staff/admin roles
    if (role === 'staff' || role === 'admin' || role === 'co-admin') {
      const { data: staffData } = await supabase
        .from("business_staff")
        .select("business_id, permissions")
        .eq("staff_id", session.user.id)
        .eq("status", "active")
        .single();
        
      if (staffData) {
        businessId = staffData.business_id;
        
        // Parse permissions if they exist
        if (staffData.permissions) {
          const permissionsObject = staffData.permissions as Record<string, boolean>;
          permissions = {
            canManageStaff: permissionsObject.canManageStaff || false,
            canManageServices: permissionsObject.canManageServices || false,
            canViewAnalytics: permissionsObject.canViewAnalytics || false,
            canManageBookings: permissionsObject.canManageBookings || false
          };
        }
      }
    } else if (role === 'business') {
      // Business owners use their own ID as the business ID
      businessId = session.user.id;
      
      // Business owners have all permissions
      permissions = {
        canManageStaff: true,
        canManageServices: true,
        canViewAnalytics: true,
        canManageBookings: true
      };
    }
    
    return {
      role,
      businessId,
      permissions
    };
  } catch (error) {
    console.error("Error getting user role info:", error);
    return null;
  }
}

export function getBusinessPermissions(roleInfo: UserRoleInfo | null): StaffPermissions {
  // Default permissions (none)
  const defaultPermissions: StaffPermissions = {
    canManageStaff: false,
    canManageServices: false,
    canViewAnalytics: false,
    canManageBookings: false
  };
  
  if (!roleInfo) return defaultPermissions;
  
  // Business owners have all permissions
  if (roleInfo.role === 'business') {
    return {
      canManageStaff: true,
      canManageServices: true,
      canViewAnalytics: true,
      canManageBookings: true
    };
  }
  
  // Co-admins can do everything except manage staff
  if (roleInfo.role === 'co-admin') {
    return {
      canManageStaff: false,
      canManageServices: true,
      canViewAnalytics: true,
      canManageBookings: true
    };
  }
  
  // Return specific permissions for staff members if available
  return roleInfo.permissions || defaultPermissions;
}

export function meetsPermissionLevel(
  requiredLevel: PermissionLevel, 
  userRole: UserRole | undefined
): boolean {
  if (!userRole) return false;
  
  const roleLevels: Record<UserRole, PermissionLevel> = {
    'business': PermissionLevel.ADMIN,
    'co-admin': PermissionLevel.ADMIN - 1,
    'admin': PermissionLevel.MANAGE,
    'staff': PermissionLevel.EDIT,
    'individual': PermissionLevel.EDIT,
    'free': PermissionLevel.VIEW
  };
  
  const userLevel = roleLevels[userRole];
  return userLevel >= requiredLevel;
}
