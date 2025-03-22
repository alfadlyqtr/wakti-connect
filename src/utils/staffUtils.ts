
// This file is kept as a stub to avoid breaking imports
// All functionality related to staff management has been removed

/**
 * Stub function that always returns false
 * Original function checked if the current user is a staff member
 */
export const isUserStaff = async (): Promise<boolean> => {
  return false;
};

/**
 * Stub function that always returns null
 * Original function returned the staff relation ID for the current user
 */
export const getStaffRelationId = async (): Promise<string | null> => {
  return null;
};

/**
 * Stub function that always returns null
 * Original function returned the business ID for which the current user is a staff member
 */
export const getStaffBusinessId = async (): Promise<string | null> => {
  return null;
};
