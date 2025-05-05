
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventFormData, EventStatus } from "@/types/event.types";
import { transformDatabaseEvent, prepareEventForStorage } from './eventHelpers';

/**
 * Updates an existing event in the database
 */
export const updateEvent = async (eventId: string, formData: EventFormData): Promise<Event | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to update events");
    }
    
    // Verify the event belongs to this user
    const { data: existingEvent, error: verifyError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('user_id', user.id)
      .single();
    
    if (verifyError || !existingEvent) {
      throw new Error("Event not found or you don't have permission to edit it");
    }
    
    // Prepare the event data
    const { title, description, startDate, location, customization, invitations, isAllDay, location_type, maps_url } = formData;
    
    // Extract start and end times from formData or create from the date
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(startDate);
    
    if (!isAllDay) {
      // Use provided start_time and end_time if available
      if (formData.start_time && formData.end_time) {
        // They are already ISO strings
      } else {
        // Set default times for non-all-day events
        startDateTime.setHours(9, 0, 0);
        endDateTime.setHours(10, 0, 0);
      }
    } else {
      // For all-day events
      startDateTime.setHours(0, 0, 0, 0);
      endDateTime.setHours(23, 59, 59, 999);
    }
    
    // Determine status based on invitations and current status
    let status: EventStatus = existingEvent.status;
    if (existingEvent.status === 'draft' && invitations && invitations.length > 0) {
      status = 'sent';
    }
    
    // Prepare the event data for update
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
      customization
    });
    
    // Update the event
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select('*')
      .single();
    
    if (updateError) {
      console.error("Error updating event:", updateError);
      throw new Error(`Failed to update event: ${updateError.message}`);
    }
    
    // Handle invitations if provided
    if (invitations && invitations.length > 0) {
      // Get existing invitations
      const { data: existingInvitations } = await supabase
        .from('event_invitations')
        .select('*')
        .eq('event_id', eventId);
      
      // Map existing invitations by email or user_id for comparison
      const existingMap = new Map();
      existingInvitations?.forEach(inv => {
        if (inv.email) {
          existingMap.set(inv.email, inv);
        } else if (inv.invited_user_id) {
          existingMap.set(inv.invited_user_id, inv);
        }
      });
      
      // Create a list of new invitations to insert
      const newInvitations = invitations.filter(inv => {
        const key = inv.email || inv.invited_user_id;
        return key && !existingMap.has(key);
      }).map(inv => ({
        event_id: eventId,
        email: inv.email,
        invited_user_id: inv.invited_user_id,
        status: 'pending',
        shared_as_link: inv.shared_as_link || false
      }));
      
      // Insert new invitations if any
      if (newInvitations.length > 0) {
        const { error: insertError } = await supabase
          .from('event_invitations')
          .insert(newInvitations);
        
        if (insertError) {
          toast({
            title: "Warning",
            description: `Event updated but some invitations failed to send`,
            variant: "destructive"
          });
        }
      }
    }
    
    // Fetch the updated event with invitations
    const { data: fullEvent, error: fetchError } = await supabase
      .from('events')
      .select('*, invitations:event_invitations(*)')
      .eq('id', eventId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching updated event:", fetchError);
      return transformDatabaseEvent(updatedEvent);
    }
    
    return transformDatabaseEvent(fullEvent);
  } catch (error: any) {
    console.error("Update event error:", error);
    throw error;
  }
};
