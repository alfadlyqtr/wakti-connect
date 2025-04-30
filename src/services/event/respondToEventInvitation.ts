
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EventResponseFormValues } from "@/types/event-guest-response.types";

export const respondToEventInvitation = async (
  eventId: string,
  invitationId: string | null, 
  response: 'accepted' | 'declined',
  guestInfo?: EventResponseFormValues
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Case 1: Authenticated user responding to invitation
    if (session?.user && invitationId) {
      const { error } = await supabase
        .from('event_invitations')
        .update({ status: response })
        .eq('id', invitationId)
        .eq('event_id', eventId);
        
      if (error) throw error;
      
      toast.success(`Event ${response === 'accepted' ? 'accepted' : 'declined'} successfully`);
      return true;
    } 
    // Case 2: Guest user responding to event
    else if (guestInfo) {
      // Create a guest response entry
      const { error } = await supabase
        .from('event_guest_responses')
        .insert([{
          event_id: eventId,
          name: guestInfo.name,
          response: response
        }]);
        
      if (error) throw error;
      
      toast.success("Thank you for your response!");
      return true;
    }
    
    throw new Error("Invalid invitation or guest information");
    
  } catch (error) {
    console.error("Error responding to invitation:", error);
    toast.error("Failed to respond to invitation");
    throw error;
  }
};

export const getEventGuestResponses = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from('event_guest_responses')
      .select('*')
      .eq('event_id', eventId);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching guest responses:", error);
    throw error;
  }
};
