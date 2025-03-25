export type UserRole = 'free' | 'individual' | 'business' | 'staff';

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
 * Business > Staff > Individual > Free
 * @param accountType The account type from the profile
 * @param isStaff Whether the user is a staff member
 * @returns The effective user role
 */
export function getEffectiveRole(accountType: string, isStaff: boolean): UserRole {
  // If user is a business owner, that takes highest priority
  if (accountType === 'business') return 'business';
  
  // If user is staff (but not a business owner), that's next priority
  if (isStaff) return 'staff';
  
  // Otherwise, use their account type or default to free
  return (accountType as UserRole) || 'free';
}
