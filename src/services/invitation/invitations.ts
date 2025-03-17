
import { supabase } from "@/integrations/supabase/client";
import { InvitationTarget, InvitationRequest, InvitationResponse } from "@/types/invitation.types";
import { fromTable } from "@/integrations/supabase/helper";

/**
 * Send an invitation to a user or email
 */
export const sendInvitation = async (
  eventId: string,
  target: InvitationTarget,
  customization: any = null,
  sharedAsLink: boolean = false
): Promise<InvitationResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No active session");
    }
    
    const { data, error } = await supabase
      .from('event_invitations')
      .insert({
        event_id: eventId,
        invited_user_id: target.type === 'user' ? target.id : null,
        email: target.type === 'email' ? target.id : null, 
        shared_as_link: sharedAsLink,
        status: 'pending'
      })
      .select('id, created_at')
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      status: 'sent',
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Error sending invitation:', error);
    throw error;
  }
};

/**
 * Recall an invitation that was previously sent
 */
export const recallInvitation = async (invitationId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('event_invitations')
      .delete()
      .eq('id', invitationId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error recalling invitation:', error);
    throw error;
  }
};

/**
 * List all sent invitations for an event
 */
export const listSentInvitations = async (eventId: string) => {
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
        profiles:invited_user_id (
          full_name, 
          display_name,
          avatar_url
        )
      `)
      .eq('event_id', eventId);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error listing invitations:', error);
    throw error;
  }
};

/**
 * List all invitations received by the current user
 */
export const listReceivedInvitations = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No active session");
    }
    
    const { data, error } = await supabase
      .from('event_invitations')
      .select(`
        id,
        status,
        created_at,
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
      .eq('invited_user_id', session.user.id);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error listing received invitations:', error);
    throw error;
  }
};
