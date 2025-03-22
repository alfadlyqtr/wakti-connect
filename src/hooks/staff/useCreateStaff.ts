
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { staffFormSchema, StaffFormValues } from "@/components/staff/validation";

export const useCreateStaff = () => {
  const [activeTab, setActiveTab] = useState("create");
  const queryClient = useQueryClient();
  
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
  
  // Check co-admin limit
  const checkCoAdminLimit = async (businessId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('business_staff')
        .select('id')
        .eq('business_id', businessId)
        .eq('role', 'co-admin')
        .eq('status', 'active');
        
      if (error) throw error;
      
      return data.length === 0;
    } catch (error) {
      console.error("Error checking co-admin limit:", error);
      return false;
    }
  };
  
  // Create staff account mutation
  const createStaffAccount = useMutation({
    mutationFn: async (values: StaffFormValues) => {
      try {
        // Get current business ID
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        
        const businessId = session.user.id;
        
        // If trying to create a co-admin, check the limit
        if (values.isCoAdmin) {
          const canAddCoAdmin = await checkCoAdminLimit(businessId);
          if (!canAddCoAdmin) {
            throw new Error("Only one Co-Admin is allowed per business");
          }
        }
        
        // Get business name to generate staff number
        const { data: businessData } = await supabase
          .from('profiles')
          .select('business_name')
          .eq('id', businessId)
          .single();
          
        const businessPrefix = businessData?.business_name 
          ? businessData.business_name.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '')
          : 'BUS';
          
        // Get staff count
        const { count } = await supabase
          .from('business_staff')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', businessId);
          
        const staffNumber = `${businessPrefix}_Staff${String(count || 0).padStart(3, '0')}`;
        
        // 1. Create the auth user account
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: values.email,
          password: values.password,
          email_confirm: true,
          user_metadata: {
            full_name: values.fullName
          }
        });
        
        if (authError) throw authError;
        if (!authData.user) throw new Error("Failed to create user account");
        
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
            staff_number: staffNumber,
            is_service_provider: values.isServiceProvider,
            permissions: values.permissions,
            status: 'active'
          })
          .select()
          .single();
        
        if (staffError) throw staffError;
        
        // Add to messages contacts automatically
        await supabase
          .from('user_contacts')
          .insert({
            user_id: businessId,
            contact_id: authData.user.id,
            status: 'accepted',
            staff_relation_id: staffData.id
          });
          
        return staffData;
      } catch (error: any) {
        console.error("Error creating staff account:", error);
        throw new Error(error.message || "Failed to create staff account");
      }
    },
    onSuccess: () => {
      toast({
        title: "Staff Created",
        description: "The staff account has been created successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['businessStaff'] });
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Staff",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = async (values: StaffFormValues) => {
    await createStaffAccount.mutateAsync(values);
    return true;
  };
  
  return {
    form,
    activeTab,
    setActiveTab,
    onSubmit,
    isSubmitting: createStaffAccount.isPending
  };
};
