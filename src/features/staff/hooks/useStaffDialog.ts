import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateStaff } from "@/hooks/staff/useCreateStaff";
import { StaffFormSchema, StaffFormValues } from "../components/StaffFormSchema";

export const useStaffDialog = (
  onSuccess?: () => void
) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createStaff, isCreating } = useCreateStaff();

  // Use react-hook-form with zod validation
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(StaffFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      position: "",
      isCoAdmin: false,
      isServiceProvider: false,
      permissions: {
        can_manage_tasks: false,
        can_manage_bookings: false,
        can_track_hours: true,
        can_log_earnings: false,
        can_view_analytics: false,
        can_view_tasks: true,
        can_update_task_status: false,
        can_view_customer_bookings: false,
        can_update_booking_status: false,
        can_create_job_cards: false,
        can_message_staff: true,
        can_edit_profile: true,
        can_update_profile: false
      },
      addToContacts: true
    }
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const onSubmit = async (data: StaffFormValues) => {
    try {
      // Extract relevant data fields
      const {
        fullName,
        email,
        password,
        position,
        isCoAdmin,
        isServiceProvider,
        permissions,
        avatar,
        addToContacts
      } = data;

      // Ensure permissions is the right type
      const typedPermissions = {
        can_manage_tasks: permissions.can_manage_tasks || false,
        can_manage_bookings: permissions.can_manage_bookings || false,
        can_track_hours: permissions.can_track_hours || true,
        can_log_earnings: permissions.can_log_earnings || false,
        can_view_analytics: permissions.can_view_analytics || false,
        can_view_tasks: permissions.can_view_tasks || true,
        can_update_task_status: permissions.can_update_task_status || false,
        can_view_customer_bookings: permissions.can_view_customer_bookings || false,
        can_update_booking_status: permissions.can_update_booking_status || false,
        can_create_job_cards: permissions.can_create_job_cards || false,
        can_message_staff: permissions.can_message_staff || true,
        can_edit_profile: permissions.can_edit_profile || true,
        can_update_profile: permissions.can_update_profile || false
      };

      // Call the create staff mutation
      await createStaff({
        fullName,
        email,
        password: password || undefined,
        position: position || undefined,
        isCoAdmin,
        isServiceProvider,
        permissions: typedPermissions,
        avatar,
        addToContacts
      });

      // Close the dialog and reset form on success
      setIsOpen(false);
      form.reset();
      
      // Call the optional onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating staff:", error);
    }
  };

  return {
    isOpen,
    setIsOpen,
    handleOpenChange,
    form,
    onSubmit,
    isSubmitting: isCreating
  };
};
