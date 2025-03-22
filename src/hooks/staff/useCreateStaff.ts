
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffFormSchema, StaffFormValues } from "@/components/staff/dialog/StaffFormSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UseCreateStaffReturn } from "./creation/types";

export const useCreateStaff = (): UseCreateStaffReturn => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      position: "",
      avatar: undefined,
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
  
  const createStaffMutation = useMutation({
    mutationFn: async (values: StaffFormValues) => {
      try {
        // Get auth token for verification
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        
        // Prepare payload
        const staffData: Record<string, any> = {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          position: values.position,
          isServiceProvider: values.isServiceProvider,
          isCoAdmin: values.isCoAdmin,
          permissions: values.permissions
        };
        
        // Add avatar to payload if provided
        if (values.avatar) {
          try {
            // Convert file to base64
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(values.avatar);
            });
            
            const avatarBase64 = await base64Promise;
            staffData.avatar = avatarBase64;
          } catch (error) {
            console.error("Error converting avatar to base64:", error);
            // Continue without avatar
          }
        }
        
        console.log("Calling create-staff edge function...");
        
        // Call the edge function to create staff
        const response = await supabase.functions.invoke("create-staff", {
          body: staffData,
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        console.log("Edge function response:", response);
        
        if (response.error) {
          console.error("Edge function error:", response.error);
          throw new Error(response.error.message || "Failed to create staff account");
        }
        
        const result = response.data;
        
        if (!result.success) {
          throw new Error(result.error || "Failed to create staff account");
        }
        
        return { success: true, data: result.data };
      } catch (error: any) {
        console.error("Error creating staff account:", error);
        return { 
          success: false, 
          error: error.message || "Failed to create staff account" 
        };
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['businessStaff'] });
        toast({
          title: "Staff Account Created",
          description: "The staff account has been created successfully.",
          variant: "default"
        });
      } else {
        toast({
          title: "Error Creating Staff",
          description: result.error || "Failed to create staff account",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Staff",
        description: error.message || "Failed to create staff account",
        variant: "destructive",
      });
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
    onSubmit,
    isSubmitting: createStaffMutation.isPending
  };
};
