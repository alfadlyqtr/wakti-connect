
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch responses for a given event
 */
export async function fetchEventResponses(eventId: string) {
  try {
    const { data, error } = await supabase
      .from('simple_guest_responses')
      .select('*')
      .eq('event_id', eventId);
      
    if (error) {
      console.error("Error fetching event responses:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchEventResponses:", error);
    return [];
  }
}

/**
 * Submit a guest response to an event
 */
export async function submitGuestResponse(eventId: string, name: string, response: 'accepted' | 'declined') {
  try {
    const { data, error } = await supabase
      .from('simple_guest_responses')
      .insert([
        { event_id: eventId, name, response }
      ])
      .select()
      .single();
      
    if (error) {
      console.error("Error submitting response:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in submitGuestResponse:", error);
    throw error;
  }
}
