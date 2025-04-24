// Define the standard user role types for the entire application
export type UserRole = 'individual' | 'business' | 'staff' | 'super-admin';

/**
 * Role hierarchy from highest to lowest permission level:
 * super-admin > business > staff > individual
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
 * Determine if one role has equal or higher privileges than another role
 * @param role The role to check
 * @param thanRole The role to compare against
 * @returns boolean indicating if role is equal or higher than thanRole
 */
export function hasEqualOrHigherRole(role: UserRole | null, thanRole: UserRole): boolean {
  if (!role) return false;
  
  const hierarchy: Record<UserRole, number> = {
    'super-admin': 4,
    'business': 3,
    'staff': 2,
    'individual': 1
  };
  
  return hierarchy[role] >= hierarchy[thanRole];
}

/**
 * Determines the effective user role with proper prioritization
 * Super-admin > Business > Staff > Individual
 * @param accountType The account type from the profile
 * @param isStaff Whether the user is a staff member
 * @param isSuperAdmin Whether the user is a super admin
 * @returns The effective user role
 */
export function getEffectiveRole(
  accountType: string | undefined | null, 
  isStaff: boolean, 
  isSuperAdmin: boolean = false
): UserRole {
  // Super-admin has highest priority
  if (isSuperAdmin) return 'super-admin';
  
  // If user is a business owner, that takes next highest priority
  if (accountType === 'business') return 'business';
  
  // If user is staff (but not a business owner), that's next priority
  if (isStaff) return 'staff';
  
  // Otherwise, they are an individual user
  return 'individual';
}
