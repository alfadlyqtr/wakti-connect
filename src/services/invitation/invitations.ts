
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { InvitationRequest, InvitationResponse, InvitationRecipient } from "@/types/invitation.types";

/**
 * Send an invitation to a user or email
 */
export const sendInvitation = async (
  eventId: string,
  invitations: InvitationRequest[]
): Promise<InvitationResponse[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    // Prepare invitation requests
    const results: InvitationResponse[] = [];
    
    for (const invitation of invitations) {
      // Process each recipient - use recipientIds, recipientEmails, or recipients based on what's available
      let recipientsToProcess: InvitationRecipient[] = [];
      
      if (invitation.recipients) {
        recipientsToProcess = invitation.recipients;
      } else {
        // Convert recipientIds to recipients of type 'user'
        const userRecipients: InvitationRecipient[] = (invitation.recipientIds || []).map(id => ({ 
          id, 
          type: 'user' as const, 
          name: '' 
        }));
        
        // Convert recipientEmails to recipients of type 'email'
        const emailRecipients: InvitationRecipient[] = (invitation.recipientEmails || []).map(email => ({ 
          id: email, 
          email, 
          type: 'email' as const, 
          name: '' 
        }));
        
        // Combine both types of recipients
        recipientsToProcess = [...userRecipients, ...emailRecipients];
      }
      
      const invitationData = recipientsToProcess.map(recipient => ({
        event_id: eventId,
        invited_user_id: recipient.type === 'user' ? recipient.id : null,
        email: recipient.type === 'email' ? recipient.email : null,
        shared_as_link: invitation.shared_as_link || false,
        status: 'pending' as 'pending' | 'accepted' | 'declined',
        created_at: new Date().toISOString()
      }));
      
      // Insert invitations
      const { data, error } = await supabase
        .from('event_invitations')
        .insert(invitationData)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Prepare response
      results.push({
        success: true,
        message: "Invitations sent successfully",
        invitationIds: data.map(inv => inv.id),
        status: 'sent',
        recipients: recipientsToProcess,
        failedRecipients: [],
        createdAt: new Date().toISOString()
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error sending invitations:', error);
    throw error;
  }
};

/**
 * Recall an invitation (mark as recalled)
 */
export const recallInvitation = async (eventId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    // First, mark the event as recalled
    const { error: eventError } = await supabase
      .from('events')
      .update({ is_recalled: true, status: 'recalled' })
      .eq('id', eventId)
      .eq('user_id', session.user.id);
    
    if (eventError) {
      throw eventError;
    }
    
    toast({
      title: "Invitation Recalled",
      description: "Your invitation has been recalled.",
    });
    
    return true;
  } catch (error) {
    console.error('Error recalling invitation:', error);
    toast({
      title: "Failed to Recall Invitation",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * List invitations sent by the current user
 */
export const listSentInvitations = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        start_time,
        end_time,
        status,
        is_recalled,
        created_at,
        event_invitations (*)
      `)
      .eq('user_id', session.user.id)
      .not('status', 'eq', 'draft')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching sent invitations:', error);
    throw error;
  }
};

/**
 * List invitations received by the current user
 */
export const listReceivedInvitations = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const { data, error } = await supabase
      .from('event_invitations')
      .select(`
        id,
        status,
        created_at,
        event:event_id (
          id,
          title,
          description,
          start_time,
          end_time,
          status,
          is_recalled,
          user_id,
          profiles:user_id (
            full_name,
            display_name,
            avatar_url
          )
        )
      `)
      .eq('invited_user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching received invitations:', error);
    throw error;
  }
};
