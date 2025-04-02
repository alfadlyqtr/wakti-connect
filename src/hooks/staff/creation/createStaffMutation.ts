
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StaffFormValues } from "@/components/staff/dialog/StaffFormSchema";
import { checkCoAdminLimit } from "./staffLimits";
import { uploadStaffAvatar } from "./avatarUpload";
import { CreateStaffResult } from "./types";
import { syncStaffBusinessContacts } from "@/services/contacts/contactSync";

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (values: StaffFormValues): Promise<CreateStaffResult> => {
      try {
        // Get current business ID
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");
        
        const businessId = session.user.id;
        console.log("Creating staff member for business:", businessId);
        
        // If trying to create a co-admin, check the limit
        if (values.isCoAdmin) {
          const canAddCoAdmin = await checkCoAdminLimit(businessId);
          if (!canAddCoAdmin) {
            throw new Error("Only one Co-Admin is allowed per business");
          }
        }
        
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
        if (!authData.user) throw new Error("Failed to create user account");
        
        console.log("Created user account for staff:", authData.user.id);
        
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
        
        console.log("Created staff record:", staffData);
        
        // Update profile table explicitly (important for contact syncing!)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            account_type: 'staff',
            avatar_url: avatarUrl,
            full_name: values.fullName,
            display_name: values.fullName,
            email: values.email,
            updated_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
        
        // Force sync contacts to ensure staff is connected
        try {
          const syncResult = await syncStaffBusinessContacts();
          console.log("Contact sync result:", syncResult);
        } catch (syncError) {
          console.error("Error syncing contacts:", syncError);
        }
          
        toast({
          title: "Staff Account Created",
          description: "The staff account has been created successfully.",
          variant: "default"
        });
        
        return { success: true, data: staffData };
      } catch (error: any) {
        console.error("Error creating staff account:", error);
        
        toast({
          title: "Error Creating Staff",
          description: error.message || "Failed to create staff account",
          variant: "destructive",
        });
        
        return { success: false, error: error.message || "Failed to create staff account" };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessStaff'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });
};
