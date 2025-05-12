
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Send an event invitation via email
export const sendEventInvitation = async (
  eventId: string, 
  email: string
): Promise<boolean> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to send invitations');
    }
    
    // First check if the invitation already exists
    const { data: existingInvite } = await supabase
      .from('event_invitations')
      .select('*')
      .eq('event_id', eventId)
      .eq('email', email)
      .single();
    
    if (existingInvite) {
      toast({
        title: 'Already invited',
        description: `${email} has already been invited to this event`,
      });
      return false;
    }
    
    // Create the invitation
    const { error } = await supabase
      .from('event_invitations')
      .insert({
        event_id: eventId,
        email: email,
        status: 'pending',
        shared_as_link: false
      });
    
    if (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
    
    toast({
      title: 'Invitation sent',
      description: `Invitation has been sent to ${email}`,
    });
    
    return true;
  } catch (error: any) {
    console.error('Error in sendEventInvitation:', error);
    toast({
      variant: 'destructive',
      title: 'Failed to send invitation',
      description: error.message || 'An error occurred while sending the invitation',
    });
    return false;
  }
};

// Get all invitations for an event
export const getEventInvitations = async (eventId: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to view invitations');
    }
    
    const { data, error } = await supabase
      .from('event_invitations')
      .select('*')
      .eq('event_id', eventId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return [];
  }
};
