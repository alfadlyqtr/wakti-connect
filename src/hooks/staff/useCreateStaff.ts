import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffFormSchema, StaffFormValues } from "@/components/staff/dialog/StaffFormSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UseCreateStaffReturn } from "./creation/types";
import { uploadStaffAvatar } from "./creation/avatarUpload";

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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        
        const businessId = session.user.id;
        
        if (values.isCoAdmin) {
          const { data: coAdmins, error: coAdminError } = await supabase
            .from('business_staff')
            .select('id')
            .eq('business_id', businessId)
            .eq('role', 'co-admin')
            .eq('status', 'active');
            
          if (coAdminError) throw coAdminError;
          
          if (coAdmins && coAdmins.length > 0) {
            throw new Error("Only one Co-Admin is allowed per business");
          }
        }
        
        const { data: businessData, error: businessError } = await supabase
          .from('profiles')
          .select('business_name')
          .eq('id', businessId)
          .single();
          
        if (businessError) throw businessError;
        
        const businessName = businessData.business_name || 'BUS';
        const prefix = businessName
          .substring(0, 3)
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '');
          
        const { count, error: countError } = await supabase
          .from('business_staff')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', businessId);
          
        if (countError) throw countError;
        
        const staffNumber = `${prefix}_Staff${String(count || 0).padStart(3, '0')}`;
        
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: values.email,
          password: values.password,
          email_confirm: true,
          user_metadata: {
            full_name: values.fullName,
            account_type: 'staff',
            business_id: businessId,
            staff_role: values.isCoAdmin ? 'co-admin' : 'staff',
            staff_number: staffNumber
          }
        });
        
        if (authError) throw authError;
        if (!authData.user) throw new Error("Failed to create user account");
        
        let avatarUrl = null;
        if (values.avatar) {
          avatarUrl = await uploadStaffAvatar(authData.user.id, values.avatar);
        }
        
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
            profile_image_url: avatarUrl,
            status: 'active'
          })
          .select()
          .single();
        
        if (staffError) throw staffError;
        
        await createStaffContacts(businessId, authData.user.id, staffData.id);
        
        await supabase
          .from('profiles')
          .update({
            account_type: 'staff',
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', authData.user.id);
        
        return { success: true, data: staffData };
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

async function createStaffContacts(businessId: string, newStaffId: string, staffRelationId: string) {
  await supabase
    .from('user_contacts')
    .insert([
      {
        user_id: businessId,
        contact_id: newStaffId,
        status: 'accepted',
        staff_relation_id: staffRelationId
      },
      {
        user_id: newStaffId,
        contact_id: businessId,
        status: 'accepted',
        staff_relation_id: staffRelationId
      }
    ]);
    
  const { data: otherStaff, error: otherStaffError } = await supabase
    .from('business_staff')
    .select('staff_id, id')
    .eq('business_id', businessId)
    .neq('staff_id', newStaffId);
    
  if (!otherStaffError && otherStaff && otherStaff.length > 0) {
    const contactInserts = [];
    
    for (const staff of otherStaff) {
      contactInserts.push({
        user_id: newStaffId,
        contact_id: staff.staff_id,
        status: 'accepted',
        staff_relation_id: staff.id
      });
      
      contactInserts.push({
        user_id: staff.staff_id,
        contact_id: newStaffId,
        status: 'accepted',
        staff_relation_id: staffRelationId
      });
    }
    
    if (contactInserts.length > 0) {
      await supabase.from('user_contacts').insert(contactInserts);
    }
  }
}
