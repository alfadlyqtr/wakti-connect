
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "@/components/staff/dialog/StaffFormSchema";

export interface UseCreateStaffReturn {
  form: UseFormReturn<StaffFormValues>;
  onSubmit: (values: StaffFormValues) => Promise<boolean>;
  isSubmitting: boolean;
}

export interface StaffCreationResponse {
  success: boolean;
  data?: any;
  error?: string;
}
