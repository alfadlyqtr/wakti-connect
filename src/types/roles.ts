// Define the standard user role types for the entire application
export type UserRole = 'superadmin' | 'business' | 'staff' | 'individual';

/**
 * Role hierarchy from highest to lowest permission level:
 * superadmin > business > staff > individual
 */

// Role comparison constants
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'superadmin': 4,
  'business': 3,
  'staff': 2,
  'individual': 1
};

/**
 * Checks if a user role has access to a feature based on allowed roles
 * @param userRole The current user's role
 * @param allowedRoles Array of roles that have access
 * @returns boolean indicating if user has access
 */
export function hasRoleAccess(userRole: UserRole | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Checks if a user role has sufficient permissions based on minimum required role
 * @param userRole The current user's role
 * @param minimumRole Minimum role required for access
 * @returns boolean indicating if user has sufficient permissions
 */
export function hasRoleLevel(userRole: UserRole | null, minimumRole: UserRole): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

/**
 * Maps database account_type to UserRole
 */
export function mapDatabaseRoleToUserRole(dbRole: string): UserRole {
  switch (dbRole) {
    case 'superadmin':
      return 'superadmin';
    case 'business':
      return 'business';
    case 'staff':
      return 'staff';
    default:
      return 'individual';
  }
}

/**
 * Determines effective role based on various user properties
 * This maintains backward compatibility with the old role system
 * @param accountType Account type from profile
 * @param isStaff Whether user is a staff member
 * @param isSuperAdmin Whether user is a super admin
 * @returns The user's effective role
 */
export function getEffectiveRole(
  accountType: string | undefined | null,
  isStaff: boolean,
  isSuperAdmin: boolean = false
): UserRole {
  // Superadmin has highest priority
  if (isSuperAdmin) return 'superadmin';
  
  // Business owner takes next highest priority
  if (accountType === 'business') return 'business';
  
  // Staff (not a business owner) is next
  if (isStaff) return 'staff';
  
  // Otherwise, individual user
  return 'individual';
}
