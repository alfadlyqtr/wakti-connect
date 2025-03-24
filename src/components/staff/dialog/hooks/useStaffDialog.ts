import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffFormSchema, StaffFormValues } from "../StaffFormSchema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useStaffDialog = (
  staffId: string | null,
  onSuccess: () => void,
  onOpenChange: (open: boolean) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = !!staffId;

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
        can_view_analytics: false,
        can_update_task_status: false,
        can_update_booking_status: false,
        can_update_profile: true
      }
    }
  });

  const { isLoading: isLoadingStaff } = useQuery({
    queryKey: ['staffMember', staffId],
    queryFn: async () => {
      try {
        if (!staffId) return null;
        
        const { data, error } = await supabase
          .from('business_staff')
          .select('*')
          .eq('id', staffId)
          .single();
          
        if (error) throw error;
        
        const permissions = typeof data.permissions === 'string' 
          ? JSON.parse(data.permissions) 
          : data.permissions;
          
        form.reset({
          fullName: data.name || "",
          email: data.email || "",
          password: "",
          confirmPassword: "",
          position: data.position || "",
          isServiceProvider: data.is_service_provider || false,
          isCoAdmin: data.role === 'co-admin',
          permissions: {
            ...form.getValues().permissions,
            ...permissions
          }
        });
        
        return data;
      } catch (error) {
        console.error("Error fetching staff details:", error);
        setError(error instanceof Error ? error.message : "Failed to load staff details");
        return null;
      }
    }
  });

  const handleSubmit = async (values: StaffFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const businessId = session.user.id;
      
      const permissions = values.permissions;
      
      if (isEditing) {
        const { error } = await supabase
          .from('business_staff')
          .update({
            name: values.fullName,
            position: values.position,
            role: values.isCoAdmin ? 'co-admin' : 'staff',
            is_service_provider: values.isServiceProvider,
            permissions,
            updated_at: new Date().toISOString()
          })
          .eq('id', staffId);
          
        if (error) throw error;
        
        toast({
          title: "Staff updated",
          description: "Staff member has been successfully updated."
        });
      } else {
        // Create new staff - This would include invitation functionality
        // Code for creating new staff would go here
        // [This part would be handled by the CreateStaffDialog]
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting staff form:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isEditing,
    activeTab,
    setActiveTab,
    handleSubmit,
    error,
    isLoadingStaff
  };
};
