
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation, AcceptInvitationData } from "../types";
import { toast } from "@/components/ui/use-toast";

/**
 * Helper function to fetch invitation by token
 */
const fetchInvitationByToken = async (token: string): Promise<StaffInvitation> => {
  console.log("Fetching invitation with token:", token);
  
  try {
    const { data: invitation, error: fetchError } = await supabase
      .from('staff_invitations')
      .select('*')
      .eq('token', token)
      .single();
      
    if (fetchError) {
      console.error("Error fetching invitation:", fetchError);
      throw new Error('Invalid invitation');
    }
    
    console.log("Found invitation:", invitation);
    return invitation as StaffInvitation;
  } catch (error) {
    console.error("Error in fetchInvitationByToken:", error);
    throw error;
  }
};

/**
 * Helper function to update invitation status
 */
const updateInvitationStatus = async (
  invitationId: string, 
  status: 'accepted' | 'declined'
): Promise<StaffInvitation> => {
  console.log(`Updating invitation ${invitationId} status to ${status}`);
  
  try {
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
  } catch (error) {
    console.error("Error in updateInvitationStatus:", error);
    throw error;
  }
};

/**
 * Helper function to create staff record
 */
const createStaffRecord = async (
  invitation: StaffInvitation,
  userId: string
) => {
  console.log("Creating staff record for user:", userId);
  
  try {
    // Check if staff record already exists
    const { data: existingStaff } = await supabase
      .from('business_staff')
      .select('id')
      .eq('business_id', invitation.business_id)
      .eq('staff_id', userId)
      .maybeSingle();
      
    if (existingStaff) {
      console.log("Staff record already exists:", existingStaff);
      return existingStaff;
    }
    
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .insert({
        business_id: invitation.business_id,
        staff_id: userId,
        role: invitation.role || 'staff',
        position: invitation.position || 'staff',
        name: invitation.name,
        email: invitation.email,
        status: 'active'
      })
      .select()
      .single();
      
    if (staffError) {
      console.error("Error creating staff record:", staffError);
      throw staffError;
    }
    
    console.log("Created staff record:", staffData);
    return staffData;
  } catch (error) {
    console.error("Error in createStaffRecord:", error);
    throw error;
  }
};

/**
 * Helper function to update user profile
 */
const updateUserProfile = async (userId: string) => {
  console.log("Updating user profile account_type to staff");
  
  try {
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
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
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
    console.log("Creating contact relationships between business and staff member");
    
    // First, check if the relationship already exists
    const { data: existingContactData } = await supabase
      .from('user_contacts')
      .select('id')
      .or(`and(user_id.eq.${businessId},contact_id.eq.${userId}),and(user_id.eq.${userId},contact_id.eq.${businessId})`)
      .maybeSingle();
      
    if (existingContactData) {
      console.log("Contact relationship already exists:", existingContactData);
      return;
    }
    
    // Create from business to staff with 'accepted' status
    const { error: error1 } = await supabase
      .from('user_contacts')
      .insert({
        user_id: businessId,
        contact_id: userId,
        status: 'accepted',
        staff_relation_id: staffRelationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (error1) {
      console.error("Error creating business->staff contact:", error1);
      throw error1;
    }
      
    // Create from staff to business with 'accepted' status  
    const { error: error2 } = await supabase
      .from('user_contacts')
      .insert({
        user_id: userId,
        contact_id: businessId,
        status: 'accepted',
        staff_relation_id: staffRelationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (error2) {
      console.error("Error creating staff->business contact:", error2);
      throw error2;
    }
      
    console.log("Created bidirectional contact relationship between staff and business");
  } catch (contactError) {
    console.error("Error in createContactRelationships:", contactError);
    // Log but continue with the process even if contact creation fails
  }
};

/**
 * Helper function to send notification to business
 */
const notifyBusinessOwner = async (invitation: StaffInvitation, userId: string) => {
  try {
    console.log("Sending notification to business owner");
    
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: invitation.business_id,
        type: 'staff_joined',
        title: 'New Staff Member Joined',
        content: `${invitation.name} has completed their account setup and joined your team`,
        related_entity_id: userId,
        related_entity_type: 'staff_account'
      });
      
    if (notificationError) {
      console.error("Error sending notification to business owner:", notificationError);
      throw notificationError;
    } else {
      console.log("Notification sent to business owner");
    }
  } catch (error) {
    console.error("Error in notifyBusinessOwner:", error);
    // Don't fail the whole process if notification fails
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
      
      try {
        // Step 1: Get the invitation
        const invitation = await fetchInvitationByToken(token);
        
        // Step 2: Update invitation status
        let updatedInvitation;
        try {
          updatedInvitation = await updateInvitationStatus(invitation.id, 'accepted');
        } catch (updateError) {
          console.error("Error updating invitation status, continuing anyway:", updateError);
          updatedInvitation = invitation;
        }
        
        // Step 3: Create staff record
        let staffData;
        try {
          staffData = await createStaffRecord(invitation, userId);
        } catch (staffError) {
          console.error("Error creating staff record:", staffError);
          throw staffError;
        }
        
        // Step 4: Update user's profile
        try {
          await updateUserProfile(userId);
        } catch (profileError) {
          console.error("Error updating profile, continuing anyway:", profileError);
        }
        
        // Step 5: Create bidirectional contact relationship
        if (staffData) {
          try {
            await createContactRelationships(invitation.business_id, userId, staffData.id);
          } catch (contactError) {
            console.error("Error creating contacts, continuing anyway:", contactError);
          }
        }
        
        // Step 6: Send notification to business owner about staff member joining
        try {
          await notifyBusinessOwner(invitation, userId);
        } catch (notifyError) {
          console.error("Error sending notification, continuing anyway:", notifyError);
        }
        
        // Step 7: Get business info and show welcome toast
        try {
          await showWelcomeToast(invitation.business_id);
        } catch (toastError) {
          console.error("Error showing welcome toast:", toastError);
        }
        
        // Update TypeScript type safety for the returned object
        return {
          ...updatedInvitation,
          status: 'accepted' as const
        } as StaffInvitation;
      } catch (error) {
        console.error("Error in acceptInvitation mutation:", error);
        throw error;
      }
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
