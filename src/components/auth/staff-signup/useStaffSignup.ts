
import { useState } from "react";
import { useInvitationVerification } from "./hooks/useInvitationVerification";
import { useStaffSignupSubmit } from "./hooks/useStaffSignupSubmit";
import { StaffSignupFormValues } from "./validation";

export { StaffSignupFormValues } from "./validation";

export const useStaffSignup = (token?: string) => {
  const { invitation, status } = useInvitationVerification(token);
  const { isSubmitting, onSubmit } = useStaffSignupSubmit(invitation, token);
  
  return {
    invitation,
    status,
    isSubmitting,
    onSubmit
  };
};
