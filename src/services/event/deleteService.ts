
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes an event by ID
 */
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  try {
    // Check if the user is authorized to delete this event
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error("Authentication required to delete events");
    }
    
    // First check if the user owns this event
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('user_id')
      .eq('id', eventId)
      .single();
    
    if (fetchError) {
      throw new Error(`Failed to verify event ownership: ${fetchError.message}`);
    }
    
    if (!event || event.user_id !== session.user.id) {
      throw new Error("You don't have permission to delete this event");
    }
    
    // Delete the event
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
    
    return true;
  } catch (error: any) {
    console.error("Error in deleteEvent service:", error);
    throw error;
  }
};
