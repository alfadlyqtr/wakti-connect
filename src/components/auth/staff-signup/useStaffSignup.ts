
import { useState } from "react";
import { useInvitationVerification } from "./hooks/useInvitationVerification";
import { useStaffSignupSubmit } from "./hooks/useStaffSignupSubmit";
import { StaffSignupFormValues } from "./validation";

// Use 'export type' instead of 'export' for type re-exports when isolatedModules is enabled
export type { StaffSignupFormValues } from "./validation";

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
