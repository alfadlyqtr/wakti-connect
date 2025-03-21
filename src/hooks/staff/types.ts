
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

export interface StaffInvitation {
  id: string;
  business_id: string;
  business_name: string; // Added business_name to the interface
  name: string;
  email: string;
  role: string;
  position?: string;
  token: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  expires_at: string;
  updated_at: string;
}

export interface CreateInvitationData {
  name: string;
  email: string;
  role: string;
  position?: string;
}

export interface VerifyInvitationData {
  token: string;
}

export interface AcceptInvitationData {
  token: string;
  userId: string;
}

// Hook return types
export interface UseStaffInvitationsQueries {
  invitations: StaffInvitation[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export interface UseStaffInvitationsMutations {
  createInvitation: UseMutationResult<StaffInvitation, Error, CreateInvitationData>;
  resendInvitation: UseMutationResult<StaffInvitation, Error, string>;
  cancelInvitation: UseMutationResult<string, Error, string>;
  verifyInvitation: UseMutationResult<StaffInvitation, Error, VerifyInvitationData>;
  acceptInvitation: UseMutationResult<StaffInvitation, Error, AcceptInvitationData>;
}

// Combined hook return type
export interface UseStaffInvitationsReturn extends UseStaffInvitationsQueries, UseStaffInvitationsMutations {}

// Staff form values interface
export interface StaffFormValues {
  name: string;
  email: string;
  role: string;
  position?: string;
  sendInvitation: boolean;
}
