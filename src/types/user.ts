/**
 * User role types for the application
 */
export type UserRole = 'free' | 'individual' | 'business' | 'staff';

/**
 * Account type from user profile
 * Note: This is different from UserRole as it excludes 'staff'
 */
export type AccountType = 'free' | 'individual' | 'business';

/**
 * Helper function to determine the effective user role
 * Prioritizes business over staff role when user has both
 */
export const getEffectiveRole = (
  accountType: AccountType | null | undefined, 
  isStaff: boolean
): UserRole => {
  // Business accounts always have business role, regardless of staff status
  if (accountType === 'business') {
    return 'business';
  }
  
  // Staff who are not business owners get staff role
  if (isStaff) {
    return 'staff';
  }
  
  // Otherwise, use account type or default to free
  return accountType || 'free';
};

/**
 * Helper to check if a user has access to a specific feature
 * based on their role and the allowed roles for that feature
 */
export const hasRoleAccess = (
  userRole: UserRole, 
  allowedRoles: UserRole[]
): boolean => {
  return allowedRoles.includes(userRole);
};
