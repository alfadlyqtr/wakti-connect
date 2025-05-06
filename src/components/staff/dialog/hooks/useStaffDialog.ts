
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateStaff } from "@/hooks/staff/useCreateStaff";
import { StaffFormSchema, StaffFormValues } from "../StaffFormSchema";
import { useStaffDetails } from "@/hooks/staff/useStaffDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useStaffDialog = (
  onSuccess?: () => void,
  initialStaffId?: string | null
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [staffId, setStaffId] = useState<string | null>(initialStaffId || null);
  const { createStaff, isCreating } = useCreateStaff();
  const queryClient = useQueryClient();
  
  // Use staff details hook to load existing data
  const { data: staffDetails, isLoading: isLoadingStaff } = useStaffDetails(staffId);
  const isEditing = !!staffId;
  
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

  // Update staffId when initialStaffId changes
  useEffect(() => {
    setStaffId(initialStaffId || null);
  }, [initialStaffId]);
  
  // Load staff details into form when available
  useEffect(() => {
    if (staffDetails && isEditing) {
      form.reset({
        fullName: staffDetails.name,
        email: staffDetails.email || "",
        position: staffDetails.position || "",
        isCoAdmin: staffDetails.role === "co-admin",
        isServiceProvider: staffDetails.is_service_provider || false,
        permissions: staffDetails.permissions || {
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
        // Don't set password fields when editing
        password: "",
        confirmPassword: "",
        addToContacts: true
      });
    }
  }, [staffDetails, form, isEditing]);

  // Update staff mutation
  const updateStaff = useMutation({
    mutationFn: async (data: StaffFormValues) => {
      if (!staffId) throw new Error("No staff ID provided for update");
      
      const permissionsData = {
        can_manage_tasks: data.permissions.can_manage_tasks || false,
        can_manage_bookings: data.permissions.can_manage_bookings || false,
        can_track_hours: data.permissions.can_track_hours || true,
        can_log_earnings: data.permissions.can_log_earnings || false,
        can_view_analytics: data.permissions.can_view_analytics || false,
        can_view_tasks: data.permissions.can_view_tasks || true,
        can_update_task_status: data.permissions.can_update_task_status || false,
        can_view_customer_bookings: data.permissions.can_view_customer_bookings || false,
        can_update_booking_status: data.permissions.can_update_booking_status || false,
        can_create_job_cards: data.permissions.can_create_job_cards || false,
        can_message_staff: data.permissions.can_message_staff || true,
        can_edit_profile: data.permissions.can_edit_profile || true,
        can_update_profile: data.permissions.can_update_profile || false
      };
      
      const { error } = await supabase
        .from('business_staff')
        .update({
          name: data.fullName,
          email: data.email,
          position: data.position,
          role: data.isCoAdmin ? 'co-admin' : 'staff',
          is_service_provider: data.isServiceProvider,
          permissions: permissionsData,
          updated_at: new Date().toISOString()
        })
        .eq('id', staffId);
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Staff Updated",
        description: "Staff member has been updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
      queryClient.invalidateQueries({ queryKey: ['staffDetails', staffId] });
      
      // Call the optional onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating staff",
        variant: "destructive"
      });
    }
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      // Only reset staffId if we're closing the dialog
      if (!open) setStaffId(null);
    }
  };

  const onSubmit = async (data: StaffFormValues) => {
    try {
      if (isEditing) {
        // Update existing staff member
        await updateStaff.mutateAsync(data);
      } else {
        // Create new staff member
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
      }

      // Close the dialog and reset form on success
      setIsOpen(false);
      form.reset();
      
      // Call the optional onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating/updating staff:", error);
    }
  };

  return {
    isOpen,
    setIsOpen,
    handleOpenChange,
    form,
    onSubmit,
    isSubmitting: isCreating || updateStaff.isPending,
    isLoading: isLoadingStaff,
    isEditing,
    staffId
  };
};
