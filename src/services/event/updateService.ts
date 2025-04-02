
import { supabase } from '@/integrations/supabase/client';
import { Event, EventFormData } from '@/types/event.types';
import { toast } from '@/components/ui/use-toast';

export async function updateEvent(eventId: string, eventData: EventFormData): Promise<Event | null> {
  try {
    // Check if the user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error('You must be logged in to update an event');
    }
    
    const userId = sessionData.session.user.id;
    
    // Basic validation
    if (!eventData.title || !eventData.title.trim()) {
      throw new Error('Event title is required');
    }
    
    if (!eventData.start_time || !eventData.end_time) {
      throw new Error('Event start and end times are required');
    }
    
    // Check if the event exists and belongs to the user
    const { data: existingEvent, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('user_id', userId)
      .single();
    
    if (eventError) {
      if (eventError.code === 'PGRST116') {
        throw new Error('Event not found or you do not have permission to update it');
      }
      throw eventError;
    }
    
    // Prepare the event object for update
    const event = {
      title: eventData.title,
      description: eventData.description || null,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      is_all_day: eventData.is_all_day ?? eventData.isAllDay ?? false,
      location: eventData.location || null,
      location_type: eventData.location_type || 'manual',
      maps_url: eventData.maps_url || null,
      status: eventData.status || existingEvent.status,
      customization: eventData.customization || existingEvent.customization
    };
    
    // Update the event in the database
    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', eventId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating event:', error);
      throw new Error(`Failed to update event: ${error.message}`);
    }
    
    // If there are new invitations, create them
    if (eventData.invitations && eventData.invitations.length > 0) {
      // First, fetch existing invitations to avoid duplicates
      const { data: existingInvitations } = await supabase
        .from('event_invitations')
        .select('email, invited_user_id')
        .eq('event_id', eventId);
      
      const existingEmails = new Set(existingInvitations?.map(i => i.email).filter(Boolean) || []);
      const existingUserIds = new Set(existingInvitations?.map(i => i.invited_user_id).filter(Boolean) || []);
      
      // Filter out invitations that already exist
      const newInvitations = eventData.invitations.filter(invite => {
        if (invite.email && existingEmails.has(invite.email)) {
          return false;
        }
        if (invite.userId && existingUserIds.has(invite.userId)) {
          return false;
        }
        return true;
      });
      
      if (newInvitations.length > 0) {
        const invitationsToInsert = newInvitations.map(invite => ({
          event_id: eventId,
          email: invite.email || null,
          invited_user_id: invite.userId || null,
          status: 'pending',
          shared_as_link: false
        }));
        
        const { error: invitationError } = await supabase
          .from('event_invitations')
          .insert(invitationsToInsert);
        
        if (invitationError) {
          console.error('Error creating new invitations:', invitationError);
          // Don't fail the event update if invitations fail
          toast({
            title: 'Warning',
            description: 'Event was updated, but there was an issue sending new invitations',
            variant: 'warning',
          });
        }
      }
    }
    
    return updatedEvent;
  } catch (error) {
    console.error('Error in updateEvent:', error);
    throw error;
  }
}
