
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StaffFormSchema, StaffFormValues } from "@/components/staff/dialog/StaffFormSchema";
import { uploadStaffAvatar } from "./creation/avatarUpload";

export interface CreateStaffParams {
  fullName: string;
  email?: string;
  password?: string;
  position?: string;
  isCoAdmin: boolean;
  isServiceProvider: boolean;
  permissions: Record<string, boolean>;
  avatar?: File;
  addToContacts: boolean;
}

export const useCreateStaff = () => {
  const { toast } = useToast();
  
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
    mutationFn: async (values: CreateStaffParams) => {
      try {
        // Get current business ID
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        
        const businessId = session.user.id;
        
        // 1. Create the auth user account
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: values.fullName,
              account_type: 'staff',
              display_name: values.fullName,
              business_id: businessId,
              staff_role: values.isCoAdmin ? 'co-admin' : 'staff'
            }
          }
        });
        
        if (authError) throw authError;
        if (!authData?.user) throw new Error("Failed to create user account");
        
        // Upload avatar if provided
        let avatarUrl = null;
        if (values.avatar) {
          avatarUrl = await uploadStaffAvatar(authData.user.id, values.avatar);
        }
        
        // 2. Add staff record to business_staff table
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .insert({
            business_id: businessId,
            staff_id: authData.user.id,
            name: values.fullName,
            email: values.email,
            position: values.position || 'Staff Member',
            role: values.isCoAdmin ? 'co-admin' : 'staff',
            is_service_provider: values.isServiceProvider,
            permissions: values.permissions,
            profile_image_url: avatarUrl,
            status: 'active'
          })
          .select()
          .single();
        
        if (staffError) throw staffError;
        
        // Update profile table
        await supabase
          .from('profiles')
          .update({
            account_type: 'staff',
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', authData.user.id);
          
        return staffData;
      } catch (error) {
        console.error("Error creating staff account:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Staff Account Created",
        description: "The staff account has been created successfully.",
        variant: "default"
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Staff",
        description: error.message || "Failed to create staff account",
        variant: "destructive",
      });
    }
  });

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
        can_manage_tasks: permissions?.can_manage_tasks || false,
        can_manage_bookings: permissions?.can_manage_bookings || false,
        can_track_hours: permissions?.can_track_hours || true,
        can_log_earnings: permissions?.can_log_earnings || false,
        can_view_analytics: permissions?.can_view_analytics || false,
        can_view_tasks: permissions?.can_view_tasks || true,
        can_update_task_status: permissions?.can_update_task_status || false,
        can_view_customer_bookings: permissions?.can_view_customer_bookings || false,
        can_update_booking_status: permissions?.can_update_booking_status || false,
        can_create_job_cards: permissions?.can_create_job_cards || false,
        can_message_staff: permissions?.can_message_staff || true,
        can_edit_profile: permissions?.can_edit_profile || true,
        can_update_profile: permissions?.can_update_profile || false
      };

      // Call the create staff mutation
      await createStaffMutation.mutateAsync({
        fullName,
        email: email || undefined,
        password: password || undefined,
        position: position || undefined,
        isCoAdmin,
        isServiceProvider,
        permissions: typedPermissions,
        avatar,
        addToContacts
      });
      
      return true;
    } catch (error) {
      console.error("Error in onSubmit:", error);
      return false;
    }
  };

  return {
    createStaff: createStaffMutation.mutateAsync,
    isCreating: createStaffMutation.isPending,
    error: createStaffMutation.error,
    form,
    onSubmit,
    isSubmitting: createStaffMutation.isPending
  };
};
