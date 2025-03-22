
import { StaffInvitation } from "../types";
import { UseMutationResult } from "@tanstack/react-query";

/**
 * Type for the accept invitation data
 */
export interface AcceptInvitationData {
  token: string;
  userId: string;
}

/**
 * Simplified hook for backward compatibility
 * Staff invitation system has been replaced with direct staff creation
 */
export const useAcceptInvitation = (): UseMutationResult<StaffInvitation, Error, AcceptInvitationData> => {
  return {
    mutate: () => {
      console.warn("Staff invitations have been deprecated");
    },
    mutateAsync: async () => {
      console.warn("Staff invitations have been deprecated");
      throw new Error("Staff invitations have been deprecated");
    },
    data: undefined,
    error: null,
    isError: false,
    isIdle: true,
    isLoading: false,
    isPending: false,
    isSuccess: false,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    submittedAt: 0,
    variables: undefined as any,
    reset: () => {},
    context: undefined
  } as UseMutationResult<StaffInvitation, Error, AcceptInvitationData>;
};
