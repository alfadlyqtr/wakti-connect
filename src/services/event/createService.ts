
import { supabase } from '@/integrations/supabase/client';
import { Event, EventFormData } from '@/types/event.types';
import { canUserCreateEvent } from './userPermissions';
import { toast } from '@/components/ui/use-toast';

export async function createEvent(eventData: EventFormData): Promise<Event | null> {
  try {
    // Check if the user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error('You must be logged in to create an event');
    }
    
    const userId = sessionData.session.user.id;
    
    // Check if the user can create events based on their subscription
    const canCreate = await canUserCreateEvent(userId);
    if (!canCreate) {
      throw new Error('Your current plan does not allow creating events');
    }
    
    // Basic validation
    if (!eventData.title || !eventData.title.trim()) {
      throw new Error('Event title is required');
    }
    
    if (!eventData.start_time || !eventData.end_time) {
      throw new Error('Event start and end times are required');
    }
    
    // Prepare the event object
    const event = {
      title: eventData.title,
      description: eventData.description || null,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      is_all_day: eventData.is_all_day ?? eventData.isAllDay ?? false,
      location: eventData.location || null,
      location_type: eventData.location_type || 'manual',
      maps_url: eventData.maps_url || null,
      status: eventData.status || 'draft',
      user_id: userId,
      customization: eventData.customization || null
    };
    
    // Insert the event into the database
    const { data: createdEvent, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event:', error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
    
    // If there are invitations, create them
    if (eventData.invitations && eventData.invitations.length > 0) {
      const invitations = eventData.invitations.map(invite => ({
        event_id: createdEvent.id,
        email: invite.email || null,
        invited_user_id: invite.userId || null,
        status: 'pending',
        shared_as_link: false
      }));
      
      const { error: invitationError } = await supabase
        .from('event_invitations')
        .insert(invitations);
      
      if (invitationError) {
        console.error('Error creating invitations:', invitationError);
        // Don't fail the event creation if invitations fail
        toast({
          title: 'Warning',
          description: 'Event was created, but there was an issue sending invitations',
          variant: 'warning',
        });
      }
    }
    
    return createdEvent;
  } catch (error) {
    console.error('Error in createEvent:', error);
    throw error;
  }
}
