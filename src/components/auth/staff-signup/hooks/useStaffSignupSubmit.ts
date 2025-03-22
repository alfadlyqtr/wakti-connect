
import { useState } from "react";
import { StaffFormValues } from "../validation";

export interface StaffSignupFormValues extends StaffFormValues {}

export const useStaffSignupSubmit = () => {
  const [isSubmitting] = useState(false);
  
  // This is now a stub since the staff signup flow has been deprecated
  const onSubmit = async () => {
    console.warn("Staff signup via invitation is deprecated.");
    return false;
  };
  
  return { isSubmitting, onSubmit };
};
