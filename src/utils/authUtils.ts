
/**
 * Generates a random token for use in invitations and auth flows
 * @returns A random string token
 */
export const generateRandomToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Formats a date to be displayed in a user-friendly format
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatInvitationDate = (date: string): string => {
  const inviteDate = new Date(date);
  return inviteDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Checks if an invitation is expired
 * @param expiryDate Expiry date of the invitation
 * @returns Boolean indicating if the invitation is expired
 */
export const isInvitationExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};
