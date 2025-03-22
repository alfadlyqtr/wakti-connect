
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffFormSchema, StaffFormValues } from "@/components/staff/dialog/StaffFormSchema";
import { useCreateStaffMutation } from "./creation/createStaffMutation";
import { UseCreateStaffReturn } from "./creation/types";

export const useCreateStaff = (): UseCreateStaffReturn => {
  const [activeTab, setActiveTab] = useState("create");
  const createStaffMutation = useCreateStaffMutation();
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      position: "",
      isServiceProvider: false,
      isCoAdmin: false,
      permissions: {
        can_view_tasks: true,
        can_manage_tasks: false,
        can_message_staff: true,
        can_manage_bookings: false,
        can_create_job_cards: false,
        can_track_hours: true,
        can_log_earnings: false,
        can_edit_profile: true,
        can_view_customer_bookings: false,
        can_view_analytics: false
      }
    }
  });
  
  const onSubmit = async (values: StaffFormValues) => {
    const result = await createStaffMutation.mutateAsync(values);
    if (result.success) {
      form.reset();
      return true;
    }
    return false;
  };
  
  return {
    form,
    activeTab,
    setActiveTab,
    onSubmit,
    isSubmitting: createStaffMutation.isPending
  };
};
