
import { supabase } from '@/lib/supabase';
import { Event, EventFormData, EventStatus } from '@/types/event.types';
import { transformDatabaseEvent, prepareEventForStorage } from './eventHelpers';
import { toast } from '@/components/ui/use-toast';

/**
 * Creates a new event in the database
 */
export const createEvent = async (formData: EventFormData): Promise<Event | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to create events");
    }
    
    // Prepare the event data
    const { title, description, startDate, location, customization, invitations, isAllDay, location_type, maps_url } = formData;
    
    // Extract start and end times from formData or create from the date
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(startDate);
    
    if (formData.start_time && formData.end_time) {
      // Use provided start_time and end_time if available
      // They are already ISO strings
    } else if (!isAllDay) {
      // Set default times for non-all-day events
      startDateTime.setHours(9, 0, 0);
      endDateTime.setHours(10, 0, 0);
    } else {
      // For all-day events
      startDateTime.setHours(0, 0, 0, 0);
      endDateTime.setHours(23, 59, 59, 999);
    }
    
    // Determine status based on invitations
    const status: EventStatus = invitations && invitations.length > 0 ? "sent" : "draft";
    
    // Prepare the event for storage
    const eventData = prepareEventForStorage({
      title,
      description,
      start_time: formData.start_time || startDateTime.toISOString(),
      end_time: formData.end_time || endDateTime.toISOString(),
      is_all_day: isAllDay,
      location,
      location_type,
      maps_url,
      status,
      user_id: user.id,
      customization
    });
    
    // Insert the event into the database
    const { data: eventResult, error: eventError } = await supabase
      .from('events')
      .insert(eventData)
      .select('*')
      .single();
    
    if (eventError) {
      console.error("Error creating event:", eventError);
      throw new Error(`Failed to create event: ${eventError.message}`);
    }
    
    // Handle invitations if provided
    if (invitations && invitations.length > 0 && eventResult) {
      const invitationsToInsert = invitations.map(invitation => ({
        event_id: eventResult.id,
        email: invitation.email,
        invited_user_id: invitation.invited_user_id,
        status: invitation.status || 'pending',
        shared_as_link: invitation.shared_as_link || false
      }));
      
      // Insert all invitations
      const { error: invitationError } = await supabase
        .from('event_invitations')
        .insert(invitationsToInsert);
      
      if (invitationError) {
        toast({
          title: "Warning",
          description: `Event created but some invitations failed: ${invitationError.message}`,
          variant: "destructive"
        });
      }
    }
    
    // Fetch the event with invitations to return
    const { data: fullEvent, error: fetchError } = await supabase
      .from('events')
      .select('*, invitations:event_invitations(*)')
      .eq('id', eventResult.id)
      .single();
    
    if (fetchError) {
      console.error("Error fetching created event:", fetchError);
      return transformDatabaseEvent(eventResult);
    }
    
    return transformDatabaseEvent(fullEvent);
  } catch (error: any) {
    console.error("Create event error:", error);
    throw error;
  }
};
