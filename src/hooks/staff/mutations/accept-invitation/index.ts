
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffInvitation, AcceptInvitationData } from "../../types";
import { fetchInvitationByToken } from "./fetchInvitation";
import { updateInvitationStatus } from "./updateInvitation";
import { createStaffRecord } from "./createStaffRecord";
import { updateUserProfile } from "./updateUserProfile";
import { createContactRelationships } from "./createContactRelationships";
import { notifyBusinessOwner, showWelcomeToast } from "./notifications";

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
