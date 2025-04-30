
import { supabase } from "@/integrations/supabase/client";

/**
 * Respond to an invitation (accept or decline)
 */
export const respondToInvitation = async (
  invitationId: string, 
  response: 'accepted' | 'declined'
): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No active session");
    }
    
    // Update the invitation status
    const { error } = await supabase
      .from('event_invitations')
      .update({ status: response === 'accepted' ? 'accepted' : 'declined' })
      .eq('id', invitationId)
      .eq('invited_user_id', session.user.id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error responding to invitation:', error);
    throw error;
  }
};

/**
 * Get an invitation by its ID
 */
export const getInvitationById = async (invitationId: string) => {
  try {
    const { data, error } = await supabase
      .from('event_invitations')
      .select(`
        id, 
        status,
        shared_as_link,
        created_at,
        invited_user_id,
        email,
        events (
          id,
          title,
          description,
          start_time,
          end_time,
          customization,
          user_id,
          profiles:user_id (
            full_name,
            display_name,
            avatar_url
          )
        )
      `)
      .eq('id', invitationId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting invitation:', error);
    throw error;
  }
};
