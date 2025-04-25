
// Define the standard user role types for the entire application
export type UserRole = 'superadmin' | 'business' | 'staff' | 'individual';

/**
 * Role hierarchy from highest to lowest permission level:
 * superadmin > business > staff > individual
 */

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

