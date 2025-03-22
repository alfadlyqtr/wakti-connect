
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation } from "../../types";

/**
 * Helper function to update invitation status
 */
export const updateInvitationStatus = async (
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
