
import { useFetchInvitations, useFetchPendingInvitations } from "./queries";
import { UseStaffInvitationsQueries } from "./types";

/**
 * Hook for fetching staff invitations
 */
export const useStaffInvitationQueries = (): UseStaffInvitationsQueries => {
  // Use the individual query hooks
  const {
    data: invitations,
    isLoading,
    error
  } = useFetchInvitations();

  // You can also destructure the pending invitations query if needed
  // const { data: pendingInvitations } = useFetchPendingInvitations();

  return {
    invitations,
    isLoading,
    error: error as Error | null
  };
};
