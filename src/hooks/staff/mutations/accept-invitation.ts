
/**
 * Simplified hook for backward compatibility
 * Staff invitation system has been replaced with direct staff creation
 */
export const useAcceptInvitation = () => {
  return {
    mutate: () => {
      console.warn("Staff invitations have been deprecated");
    },
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false
  };
};
