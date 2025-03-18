
import { supabase } from "@/integrations/supabase/client";

/**
 * Respond to an event invitation (accept or decline)
 */
export const respondToInvitation = async (
  eventId: string,
  response: 'accepted' | 'declined'
): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("Authentication required to respond to invitations");
    }
    
    // Find the invitation for this user and event
    const { data: invitation, error: fetchError } = await supabase
      .from('event_invitations')
      .select('id')
      .eq('event_id', eventId)
      .eq('invited_user_id', session.user.id)
      .single();
    
    if (fetchError) {
      console.error("Error fetching invitation:", fetchError);
      throw new Error("Could not find your invitation");
    }
    
    if (!invitation) {
      throw new Error("You don't have an invitation for this event");
    }
    
    // Update the invitation status
    const { error: updateError } = await supabase
      .from('event_invitations')
      .update({ status: response })
      .eq('id', invitation.id);
    
    if (updateError) {
      console.error("Error updating invitation:", updateError);
      throw new Error("Failed to update invitation status");
    }
    
    return true;
  } catch (error: any) {
    console.error("Error in respondToInvitation:", error);
    throw error;
  }
};

/**
 * Get responses for an event
 */
export const getEventResponses = async (eventId: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("Authentication required to get event responses");
    }
    
    // Check if the user is the event owner
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('user_id')
      .eq('id', eventId)
      .single();
      
    if (eventError || !event) {
      throw new Error("Event not found");
    }
    
    if (event.user_id !== session.user.id) {
      throw new Error("You can only view responses for events you created");
    }
    
    // Get all invitations for the event
    const { data: invitations, error: invitationsError } = await supabase
      .from('event_invitations')
      .select('id, invited_user_id, email, status, created_at, updated_at')
      .eq('event_id', eventId);
    
    if (invitationsError) {
      throw new Error("Failed to fetch responses");
    }
    
    return {
      accepted: invitations.filter(inv => inv.status === 'accepted'),
      declined: invitations.filter(inv => inv.status === 'declined'),
      pending: invitations.filter(inv => inv.status === 'pending')
    };
  } catch (error: any) {
    console.error("Error getting event responses:", error);
    throw error;
  }
};
