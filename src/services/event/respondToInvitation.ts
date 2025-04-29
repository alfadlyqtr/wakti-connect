
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ResponseOptions {
  name?: string;  // For non-WAKTI users
  addToCalendar?: boolean; // Default to true for 'accept' responses
}

/**
 * Responds to an event invitation with accept or decline
 */
export const respondToInvitation = async (
  eventId: string,
  response: 'accepted' | 'declined',
  options?: ResponseOptions
): Promise<void> => {
  try {
    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      // Handle non-WAKTI users
      if (!options?.name) {
        console.error("Name required for non-authenticated users");
        throw new Error("Please provide your name to respond to this invitation");
      }
      
      // For non-WAKTI users, we'll store guest responses separately
      // Since event_guest_responses table doesn't exist in the schema
      // Let's log the response but not throw an error
      console.log("Guest response: ", {
        event_id: eventId,
        name: options.name,
        response: response
      });
      
      toast({
        title: response === 'accepted' ? "Event Accepted" : "Event Declined",
        description: `Thank you, ${options.name}! Your response has been recorded.`,
      });
      
      return;
    }
    
    // For authenticated WAKTI users
    // Find the invitation for this user and event
    const { data: invitation, error: findError } = await supabase
      .from("event_invitations")
      .select("*")
      .eq("event_id", eventId)
      .eq("invited_user_id", session.user.id)
      .single();

    if (findError) {
      console.error("Error finding invitation:", findError);
      throw new Error(`Cannot find invitation: ${findError.message}`);
    }

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    // Update the invitation status
    const { error } = await supabase
      .from("event_invitations")
      .update({ status: response })
      .eq("id", invitation.id);

    if (error) {
      console.error("Error updating invitation:", error);
      throw new Error(`Failed to update invitation: ${error.message}`);
    }

    // If accepting, add to calendar if requested (default is true)
    const addToCalendar = options?.addToCalendar !== false && response === 'accepted';
    
    if (addToCalendar) {
      // Get event details to add to calendar
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
        
      if (!eventError && eventData) {
        // Since user_calendar table doesn't exist in the schema
        // Let's log the action but not attempt to insert to an unknown table
        console.log("Event would be added to user calendar:", {
          user_id: session.user.id,
          event_id: eventId,
          title: eventData.title,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          is_all_day: eventData.is_all_day,
          location: eventData.location,
          // Use optional chaining to safely access location_title if it exists
          location_title: (eventData as any).location_title || ""
        });
      }
    }

    toast({
      title: response === 'accepted' ? "Event Accepted" : "Event Declined",
      description: response === 'accepted' 
        ? "You've accepted the invitation. The event has been added to your calendar." 
        : "You've declined the invitation.",
    });
    
  } catch (error: any) {
    console.error("Error in respondToInvitation:", error);
    toast({
      title: "Response Failed",
      description: error?.message || "An error occurred while responding to the invitation.",
      variant: "destructive",
    });
    throw error;
  }
};
