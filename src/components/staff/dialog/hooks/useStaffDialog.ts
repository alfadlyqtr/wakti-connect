
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { fromTable } from "@/integrations/supabase/helper";
import { supabase } from "@/integrations/supabase/client";
import { staffFormSchema, StaffFormValues } from "../StaffFormSchema";

export function useStaffDialog(
  staffId: string | null,
  onSuccess: () => void,
  onOpenChange: (open: boolean) => void
) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!staffId;
  const [activeTab, setActiveTab] = useState<string>("create");
  
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
        can_manage_tasks: false,
        can_manage_bookings: false,
        can_track_hours: true,
        can_log_earnings: false,
        can_view_analytics: false
      }
    }
  });
  
  useEffect(() => {
    if (isEditing && staffId && open) {
      const fetchStaffData = async () => {
        try {
          const { data: staffData } = await fromTable('business_staff')
            .select(`
              *,
              profiles:staff_id (
                avatar_url,
                full_name
              )
            `)
            .eq('id', staffId)
            .single();
            
          if (staffData) {
            form.setValue('fullName', staffData.name);
            form.setValue('email', staffData.email);
            form.setValue('position', staffData.position || '');
            form.setValue('isCoAdmin', staffData.role === 'co-admin');
            form.setValue('isServiceProvider', staffData.is_service_provider);
            
            // Parse permissions if it's a string
            let permissions = staffData.permissions;
            if (typeof permissions === 'string') {
              try {
                permissions = JSON.parse(permissions);
              } catch (e) {
                console.error("Error parsing permissions:", e);
                permissions = {};
              }
            }
            
            form.setValue('permissions', {
              can_manage_tasks: permissions?.can_manage_tasks || false,
              can_manage_bookings: permissions?.can_manage_bookings || false,
              can_track_hours: permissions?.can_track_hours || true,
              can_log_earnings: permissions?.can_log_earnings || false,
              can_view_analytics: permissions?.can_view_analytics || false
            });
          }
        } catch (error) {
          console.error("Error fetching staff data:", error);
          toast({
            title: "Error",
            description: "Failed to load staff data",
            variant: "destructive"
          });
        }
      };
      
      fetchStaffData();
    }
  }, [isEditing, staffId, form, toast]);
  
  const handleSubmit = async (values: StaffFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        // Update existing staff
        await fromTable('business_staff')
          .update({
            name: values.fullName,
            position: values.position,
            role: values.isCoAdmin ? 'co-admin' : 'staff',
            is_service_provider: values.isServiceProvider,
            permissions: values.permissions
          })
          .eq('id', staffId);
          
        toast({
          title: "Staff Updated",
          description: "Staff member has been successfully updated."
        });
      } else {
        // Get current session for business ID
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        
        // Create staff member using Edge Function
        const response = await supabase.functions.invoke("create-staff", {
          body: {
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            position: values.position,
            role: values.isCoAdmin ? 'co-admin' : 'staff',
            isServiceProvider: values.isServiceProvider,
            permissions: values.permissions,
            avatar: values.avatar
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        if (response.error) {
          throw new Error(response.error.message || "Failed to create staff account");
        }

        toast({
          title: "Staff Created",
          description: "Staff member has been successfully created."
        });
      }
      
      // Close dialog and refresh data
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving staff:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save staff",
        variant: "destructive"
      });
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
    handleSubmit
  };
}
