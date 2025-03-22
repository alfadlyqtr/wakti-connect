
import { UseStaffInvitationsMutations } from "./types";
import { 
  useCreateInvitation,
  useResendInvitation, 
  useCancelInvitation,
  useVerifyInvitation,
  useAcceptInvitation
} from "./mutations";

/**
 * Hook for staff invitation mutations (create, resend, cancel, verify, accept)
 */
export const useStaffInvitationMutations = (): UseStaffInvitationsMutations => {
  // Use individual mutation hooks
  const createInvitation = useCreateInvitation();
  const resendInvitation = useResendInvitation();
  const cancelInvitation = useCancelInvitation();
  const verifyInvitation = useVerifyInvitation();
  const acceptInvitation = useAcceptInvitation();

  return {
    createInvitation,
    resendInvitation,
    cancelInvitation,
    verifyInvitation,
    acceptInvitation
  };
};
