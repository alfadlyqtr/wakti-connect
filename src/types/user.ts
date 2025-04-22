export type UserRole = 'individual' | 'business' | 'staff' | 'super-admin';

/**
 * Checks if a user role has access to a feature based on allowed roles
 * @param userRole The current user's role
 * @param allowedRoles Array of roles that have access
 * @returns boolean indicating if user has access
 */
export function hasRoleAccess(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
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
  accountType: string | undefined, 
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
