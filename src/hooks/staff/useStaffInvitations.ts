
import { useStaffInvitationQueries } from "./useStaffInvitationQueries";
import { useStaffInvitationMutations } from "./useStaffInvitationMutations";
import { UseStaffInvitationsReturn } from "./types";

/**
 * Combined hook for staff invitations functionality
 * Provides both queries and mutations for staff invitations
 */
export const useStaffInvitations = (): UseStaffInvitationsReturn => {
  // Get queries (data fetching)
  const { invitations, isLoading, error, refetch } = useStaffInvitationQueries();
  
  // Get mutations (data operations)
  const { 
    createInvitation,
    resendInvitation,
    cancelInvitation,
    verifyInvitation,
    acceptInvitation
  } = useStaffInvitationMutations();

  // Return combined result
  return {
    invitations,
    isLoading,
    error,
    refetch,
    createInvitation,
    resendInvitation,
    cancelInvitation,
    verifyInvitation,
    acceptInvitation
  };
};
