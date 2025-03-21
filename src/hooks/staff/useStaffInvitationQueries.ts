
import { useQuery } from "@tanstack/react-query";
import { fetchInvitations } from "./queries";
import { UseStaffInvitationsQueries } from "./types";

/**
 * Hook for fetching staff invitations
 */
export const useStaffInvitationQueries = (): UseStaffInvitationsQueries => {
  // Use the fetchInvitations query function with useQuery
  const {
    data: invitations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['staffInvitations'],
    queryFn: fetchInvitations
  });

  // You can also use the pending invitations query if needed
  // const { data: pendingInvitations } = useQuery({
  //   queryKey: ['pendingStaffInvitations'],
  //   queryFn: useFetchPendingInvitations
  // });

  return {
    invitations,
    isLoading,
    error: error as Error | null
  };
};
