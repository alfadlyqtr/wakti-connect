
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
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { name } = options;
    
    console.log(`Recording response: ${response} for event ${eventId} by ${name}`);
    
    // Simple insert to event_guest_responses
    const { data, error } = await supabase
      .from('event_guest_responses')
      .insert({
        event_id: eventId,
        name: name,
        response
      })
      .select();
      
    if (error) {
      console.error("Error responding to invitation:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    console.log("Response recorded successfully:", data);
    return { success: true };
  } catch (error: any) {
    console.error("Exception responding to invitation:", error);
    return { 
      success: false, 
      error: error.message || "Unknown error occurred" 
    };
  }
};

/**
 * Fetch responses for an event
 */
export const fetchEventResponses = async (eventId: string): Promise<EventGuestResponse[]> => {
  try {
    console.log(`Fetching responses for event: ${eventId}`);
    
    // Get responses for the event
    const { data, error } = await supabase
      .from('event_guest_responses')
      .select('*')
      .eq('event_id', eventId);
    
    if (error) {
      console.error("Error fetching responses:", error);
      throw error;
    }
    
    // Make sure the response property is cast to the correct type
    if (!data) return [];
    
    console.log(`Found ${data.length} responses for event ${eventId}`);
    
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
