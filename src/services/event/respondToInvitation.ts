
import { supabase } from "@/integrations/supabase/client";
import { EventGuestResponse } from "@/types/event-guest-response.types";

interface RespondOptions {
  name: string;
}

/**
 * Simple function to record an event response with guest name
 */
export const respondToInvitation = async (
  eventId: string,
  response: 'accepted' | 'declined',
  options: RespondOptions
): Promise<boolean> => {
  try {
    const { name } = options;
    
    // Simple insert to event_guest_responses
    const { error } = await supabase
      .from('event_guest_responses')
      .insert({
        event_id: eventId,
        name: name,
        response
      });
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error responding to invitation:", error);
    return false;
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
    
    // Make sure the response property is cast to the correct type
    if (!data) return [];
    
    return data.map(item => ({
      id: item.id,
      event_id: item.event_id,
      name: item.name,
      response: item.response as 'accepted' | 'declined',
      created_at: item.created_at
    }));
  } catch (error) {
    console.error("Error fetching responses:", error);
    return [];
  }
};
