
/**
 * Stub implementation of staff access control
 * Always returns true to maintain functionality
 */
export const canStaffMessageUser = async (userId: string): Promise<boolean> => {
  // Always return true
  return true;
};
