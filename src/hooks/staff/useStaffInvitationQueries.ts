
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
    error,
    refetch
  } = useQuery({
    queryKey: ['staffInvitations'],
    queryFn: fetchInvitations,
    refetchInterval: 10000, // Refetch every 10 seconds to catch status changes
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  return {
    invitations,
    isLoading,
    error: error as Error | null,
    refetch
  };
};
