
import { supabase } from "@/integrations/supabase/client";
import { EventGuestResponse } from "@/types/event-guest-response.types";
import { createGoogleCalendarUrl, createICSFile } from "@/services/event/createICSFile";
import { EventWithResponses } from "@/types/event-guest-response.types";

interface RespondOptions {
  name?: string;
  addToCalendar?: boolean;
}

/**
 * Respond to an event invitation (accept or decline)
 */
export const respondToInvitation = async (
  eventId: string,
  response: 'accepted' | 'declined',
  options: RespondOptions = {}
): Promise<boolean> => {
  const { name, addToCalendar } = options;
  
  try {
    // For anonymous users, name is required
    if (!name) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Name is required for non-authenticated users");
      }
    }
    
    // Record response in event_guest_responses
    const { error } = await supabase
      .from('event_guest_responses')
      .insert({
        event_id: eventId,
        name: name || 'Anonymous User',
        response
      });
      
    if (error) throw error;
    
    // If the user wants to add the event to their calendar and they accepted
    if (addToCalendar && response === 'accepted') {
      await addEventToCalendar(eventId);
    }
    
    return true;
  } catch (error: any) {
    console.error("Error responding to invitation:", error);
    throw error;
  }
};

/**
 * Helper to add an event to calendar
 */
const addEventToCalendar = async (eventId: string) => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('title, description, location, start_time, end_time')
      .eq('id', eventId)
      .single();
      
    if (error) throw error;
    
    if (event) {
      // Create calendar entry
      createICSFile({
        title: event.title,
        description: event.description,
        location: event.location,
        start: new Date(event.start_time),
        end: new Date(event.end_time)
      });
    }
  } catch (error) {
    console.error("Error adding event to calendar:", error);
  }
};

/**
 * Get an event with its guest responses
 */
export const getEventWithResponses = async (eventId: string): Promise<EventWithResponses | null> => {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        id, 
        title, 
        description, 
        start_time, 
        end_time, 
        location,
        location_title,
        user_id
      `)
      .eq('id', eventId)
      .single();
    
    if (error) throw error;
    
    if (!event) return null;
    
    // Get responses for the event
    const { data: responsesRaw } = await supabase
      .from('event_guest_responses')
      .select('*')
      .eq('event_id', eventId);
    
    // Convert response strings to the expected union type
    const responses: EventGuestResponse[] = (responsesRaw || []).map(resp => ({
      ...resp,
      response: resp.response === 'accepted' ? 'accepted' : 'declined'
    }));
    
    return {
      ...event,
      sender_name: 'Event Organizer',
      guest_responses: responses
    };
  } catch (error) {
    console.error("Error fetching event with responses:", error);
    return null;
  }
};

/**
 * Fetch responses for an event
 */
export const fetchEventResponses = async (eventId: string): Promise<EventGuestResponse[]> => {
  try {
    // Get responses for the event
    const { data, error } = await supabase
      .from('event_guest_responses')
      .select('*')
      .eq('event_id', eventId);
    
    if (error) throw error;
    
    // Convert response strings to the expected union type
    const responses: EventGuestResponse[] = (data || []).map(resp => ({
      ...resp,
      response: resp.response === 'accepted' ? 'accepted' : 'declined'
    }));
    
    return responses;
  } catch (error) {
    console.error("Error fetching responses:", error);
    return [];
  }
};
