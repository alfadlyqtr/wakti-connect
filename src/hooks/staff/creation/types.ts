
import { StaffFormValues } from "@/components/staff/dialog/StaffFormSchema";

export interface CreateStaffResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface UseCreateStaffReturn {
  form: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSubmit: (values: StaffFormValues) => Promise<boolean>;
  isSubmitting: boolean;
}
