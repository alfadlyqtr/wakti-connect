
import { StaffFormValues } from "./validation";

// Use the imported types
export type { StaffFormValues as StaffSignupFormValues } from "./validation";

export const useStaffSignup = () => {
  return {
    invitation: null,
    status: "deprecated",
    isSubmitting: false,
    onSubmit: () => Promise.resolve(false)
  };
};
