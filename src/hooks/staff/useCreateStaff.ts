
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStaffRecord } from "@/utils/createStaffRecord";
import { StaffFormSchema, type StaffFormValues } from "@/components/staff/dialog/StaffFormSchema";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type CreateStaffParams = Omit<StaffFormValues, "confirmPassword"> & {
  password?: string;
};

export function useCreateStaff() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const createStaffMutation = useMutation({
    mutationFn: async (staffData: CreateStaffParams) => {
      // Extract and map data to the correct structure for the API
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
      } = staffData;

      // Create the staff record and handle any permissions
      const result = await createStaffRecord({
        fullName,
        email,
        password: password || "",
        position,
        isCoAdmin,
        isServiceProvider,
        permissions: {
          can_manage_tasks: permissions.can_manage_tasks,
          can_manage_bookings: permissions.can_manage_bookings,
          can_track_hours: permissions.can_track_hours,
          can_log_earnings: permissions.can_log_earnings,
          can_view_analytics: permissions.can_view_analytics,
          // Include all the additional permissions
          can_view_tasks: permissions.can_view_tasks,
          can_update_task_status: permissions.can_update_task_status,
          can_view_customer_bookings: permissions.can_view_customer_bookings,
          can_update_booking_status: permissions.can_update_booking_status,
          can_create_job_cards: permissions.can_create_job_cards,
          can_message_staff: permissions.can_message_staff,
          can_edit_profile: permissions.can_edit_profile,
          can_update_profile: permissions.can_update_profile
        },
        avatar,
        addToContacts
      });

      return result;
    },
    onSuccess: () => {
      toast({
        title: "Staff member created",
        description: "The staff member has been successfully added to your team.",
      });
      // Invalidate staff queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create staff member",
        description: error.message || "There was an error creating the staff member",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: StaffFormValues) => {
    setIsSubmitting(true);
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
      } = values;

      // Call the create staff mutation
      await createStaffMutation.mutateAsync({
        fullName,
        email,
        password: password || undefined,
        position: position || undefined,
        isCoAdmin,
        isServiceProvider,
        permissions,
        avatar,
        addToContacts
      });

      // Reset form on success
      form.reset();
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error("Error creating staff:", error);
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    createStaff: createStaffMutation.mutateAsync,
    isCreating: createStaffMutation.isPending,
    error: createStaffMutation.error,
    // Add these props for the component
    form,
    onSubmit,
    isSubmitting
  };
}
