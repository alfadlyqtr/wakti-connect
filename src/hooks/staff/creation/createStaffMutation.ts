import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StaffFormValues } from "@/components/staff/dialog/StaffFormSchema";
import { checkCoAdminLimit } from "./staffLimits";
import { uploadStaffAvatar } from "./avatarUpload";
import { CreateStaffResult } from "./types";

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
        
        // Add to messages contacts automatically - business to staff
        await supabase
          .from('user_contacts')
          .insert({
            user_id: businessId,
            contact_id: authData.user.id,
            status: 'accepted',
            staff_relation_id: staffData.id
          });
          
        // Staff to business contact
        await supabase
          .from('user_contacts')
          .insert({
            user_id: authData.user.id,
            contact_id: businessId,
            status: 'accepted',
            staff_relation_id: staffData.id
          });
          
        // Create staff-to-staff contacts
        await createStaffContacts(businessId, authData.user.id, staffData.id);
        
        // Update profile table
        await supabase
          .from('profiles')
          .update({
            account_type: 'staff',
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', authData.user.id);
          
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
    }
  });
};

/**
 * Creates contact relationships between the new staff member and existing staff
 */
async function createStaffContacts(businessId: string, newStaffId: string, staffRelationId: string) {
  // Get other staff members to create contacts with
  const { data: otherStaff, error: otherStaffError } = await supabase
    .from('business_staff')
    .select('staff_id, id')
    .eq('business_id', businessId)
    .neq('staff_id', newStaffId);
    
  if (!otherStaffError && otherStaff && otherStaff.length > 0) {
    // Create contacts between all staff members
    const contactInserts = [];
    
    for (const staff of otherStaff) {
      // New staff to existing staff
      contactInserts.push({
        user_id: newStaffId,
        contact_id: staff.staff_id,
        status: 'accepted',
        staff_relation_id: staff.id
      });
      
      // Existing staff to new staff
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
