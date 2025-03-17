
import { supabase } from "@/integrations/supabase/client";

/**
 * Respond to an invitation
 */
export const respondToInvitation = async (
  invitationId: string,
  accept: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    const { error } = await supabase
      .from('appointment_invitations')
      .update({
        status: accept ? 'accepted' : 'declined'
      })
      .eq('id', invitationId)
      .eq('invited_user_id', session.user.id);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error responding to invitation:", error);
    return {
      success: false,
      error: error.message || "Unknown error responding to invitation"
    };
  }
};
