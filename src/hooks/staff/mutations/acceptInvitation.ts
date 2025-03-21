
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation, AcceptInvitationData } from "../types";
import { toast } from "@/components/ui/use-toast";

/**
 * Helper function to fetch invitation by token
 */
const fetchInvitationByToken = async (token: string): Promise<StaffInvitation> => {
  console.log("Fetching invitation with token:", token);
  
  const { data: invitation, error: fetchError } = await supabase
    .from('staff_invitations')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .single();
    
  if (fetchError) {
    console.error("Error fetching invitation:", fetchError);
    throw new Error('Invalid invitation');
  }
  
  console.log("Found invitation:", invitation);
  return invitation as StaffInvitation;
};

/**
 * Helper function to update invitation status
 */
const updateInvitationStatus = async (
  invitationId: string, 
  status: 'accepted' | 'declined'
): Promise<StaffInvitation> => {
  console.log(`Updating invitation ${invitationId} status to ${status}`);
  
  const { data: updatedInvitation, error: updateError } = await supabase
    .from('staff_invitations')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', invitationId)
    .select('*')
    .single();
    
  if (updateError) {
    console.error(`Error updating invitation status to ${status}:`, updateError);
    throw updateError;
  }
  
  console.log(`Updated invitation status to ${status}`);
  return updatedInvitation as StaffInvitation;
};

/**
 * Helper function to create staff record
 */
const createStaffRecord = async (
  invitation: StaffInvitation,
  userId: string
) => {
  console.log("Creating staff record for user:", userId);
  
  const { data: staffData, error: staffError } = await supabase
    .from('business_staff')
    .insert({
      business_id: invitation.business_id,
      staff_id: userId,
      role: invitation.role,
      position: invitation.position || 'staff',
      name: invitation.name,
      email: invitation.email
    })
    .select()
    .single();
    
  if (staffError) {
    console.error("Error creating staff record:", staffError);
    throw staffError;
  }
  
  console.log("Created staff record:", staffData);
  return staffData;
};

/**
 * Helper function to update user profile
 */
const updateUserProfile = async (userId: string) => {
  console.log("Updating user profile account_type to staff");
  
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      account_type: 'staff',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  if (profileError) {
    console.error("Error updating user profile account_type:", profileError);
    throw profileError;
  }
  
  console.log("Updated user profile account_type to staff");
};

/**
 * Helper function to create contact relationships
 */
const createContactRelationships = async (
  businessId: string,
  userId: string,
  staffRelationId: string
) => {
  try {
    // First, check if the relationship already exists
    const { data: existingContactData } = await supabase
      .from('user_contacts')
      .select('id')
      .or(`and(user_id.eq.${businessId},contact_id.eq.${userId}),and(user_id.eq.${userId},contact_id.eq.${businessId})`)
      .maybeSingle();
      
    if (!existingContactData) {
      // Create from business to staff with 'accepted' status
      await supabase
        .from('user_contacts')
        .insert({
          user_id: businessId,
          contact_id: userId,
          status: 'accepted',
          staff_relation_id: staffRelationId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      // Create from staff to business with 'accepted' status  
      await supabase
        .from('user_contacts')
        .insert({
          user_id: userId,
          contact_id: businessId,
          status: 'accepted',
          staff_relation_id: staffRelationId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      console.log("Created bidirectional contact relationship between staff and business");
    } else {
      console.log("Contact relationship already exists, skipping creation");
    }
  } catch (contactError) {
    // Log but don't fail the whole process if contact creation fails
    console.error("Error creating contact relationship:", contactError);
  }
};

/**
 * Helper function to show welcome toast
 */
const showWelcomeToast = async (businessId: string) => {
  try {
    const { data: businessData } = await supabase
      .from('profiles')
      .select('business_name')
      .eq('id', businessId)
      .single();
      
    if (businessData?.business_name) {
      // Show welcome toast
      toast({
        title: `Welcome to ${businessData.business_name}!`,
        description: "You've successfully joined as a staff member.",
        duration: 5000,
      });
    }
  } catch (error) {
    console.error("Error fetching business data for notification:", error);
  }
};

/**
 * Hook for accepting staff invitations
 */
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ token, userId }: AcceptInvitationData): Promise<StaffInvitation> => {
      console.log("Accepting invitation with token:", token, "for user:", userId);
      
      // Step 1: Get the invitation
      const invitation = await fetchInvitationByToken(token);
      
      // Step 2: Update invitation status
      const updatedInvitation = await updateInvitationStatus(invitation.id, 'accepted');
      
      // Step 3: Create staff record
      const staffData = await createStaffRecord(invitation, userId);
      
      // Step 4: Update user's profile
      await updateUserProfile(userId);
      
      // Step 5: Create bidirectional contact relationship
      await createContactRelationships(invitation.business_id, userId, staffData.id);
      
      // Step 6: Get business info and show welcome toast
      await showWelcomeToast(invitation.business_id);
      
      // Update TypeScript type safety for the returned object
      return {
        ...updatedInvitation,
        status: 'accepted' as const
      } as StaffInvitation;
    },
    onSuccess: () => {
      // Invalidate relevant queries when the invitation is accepted
      queryClient.invalidateQueries({ queryKey: ['staffInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['businessStaff'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['staffBusinessInfo'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardUserProfile'] });
    }
  });
};
