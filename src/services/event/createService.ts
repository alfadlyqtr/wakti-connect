
import { EventFormData, Event, EventStatus } from '@/types/event.types';
import { supabase } from '@/lib/supabase';
import { prepareEventForStorage, transformDatabaseEvent } from './eventHelpers';
import { toast } from '@/components/ui/use-toast';

/**
 * Creates a new event with the given data
 */
export const createEvent = async (formData: EventFormData): Promise<Event> => {
  try {
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Format dates for database
    const startDate = formData.startDate;
    let startDateString = startDate.toISOString();
    let endDateString = formData.endDate ? formData.endDate.toISOString() : startDateString;
    
    // If not all day, apply the specific times
    if (!formData.isAllDay && formData.startTime) {
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      const startDateWithTime = new Date(startDate);
      startDateWithTime.setHours(startHours, startMinutes, 0);
      startDateString = startDateWithTime.toISOString();
      
      if (formData.endTime) {
        const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
        const endDateWithTime = formData.endDate ? new Date(formData.endDate) : new Date(startDate);
        endDateWithTime.setHours(endHours, endMinutes, 0);
        endDateString = endDateWithTime.toISOString();
      }
    }
    
    // Prepare the event data
    const eventData = {
      title: formData.title,
      description: formData.description || '',
      location: formData.location || '',
      location_type: formData.location_type || 'manual',
      maps_url: formData.maps_url || '',
      start_time: startDateString,
      end_time: endDateString,
      is_all_day: formData.isAllDay,
      status: (formData.status || 'draft') as EventStatus,
      user_id: user.id,
      customization: prepareEventForStorage(formData.customization)
    };
    
    // Insert the event into the database
    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }
    
    // Prepare invitation data if there are recipients
    if (formData.invitations && formData.invitations.length > 0) {
      const invitations = formData.invitations.map(invite => ({
        event_id: event.id,
        email: invite.email || '',
        invited_user_id: invite.invited_user_id || null,
        status: 'pending',
        shared_as_link: invite.shared_as_link || false
      }));
      
      // Insert invitations
      const { error: invitationError } = await supabase
        .from('event_invitations')
        .insert(invitations);
        
      if (invitationError) {
        console.error('Error creating invitations:', invitationError);
        toast({
          title: 'Invitations Not Sent',
          description: 'The event was created but there was an issue sending invitations.',
          variant: 'destructive',
        });
      }
    }
    
    // Transform the event data for the frontend
    return transformDatabaseEvent(event);
  } catch (error) {
    console.error('Error in createEvent:', error);
    throw error;
  }
};
