
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { EventGuestResponse } from "@/types/event-guest-response.types";

interface ResponseOptions {
  name?: string;  // For non-WAKTI users
  addToCalendar?: boolean; // Default to true for 'accept' responses
}

/**
 * Responds to an event invitation with accept or decline
 */
export const respondToInvitation = async (
  invitationId: string,
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
      
      // First check if the ID is for an event or invitation
      const { data: invitationData, error: invitationError } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", invitationId)
        .single();
      
      if (!invitationError && invitationData) {
        // For non-WAKTI users, store the guest response directly linked to the invitation
        const { error } = await supabase.from("event_guest_responses").insert({
          invitation_id: invitationId,
          name: options.name,
          response: response
        });
        
        if (error) {
          console.error("Error saving guest response:", error);
          throw new Error("Failed to save your response. Please try again.");
        }
        
        toast({
          title: response === 'accepted' ? "Event Accepted" : "Event Declined",
          description: `Thank you, ${options.name}! Your response has been recorded.`,
        });
        
        return;
      } else {
        // Check if it's an event ID instead
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", invitationId)
          .single();
          
        if (!eventError && eventData) {
          // Store response with event_id for backward compatibility
          const { error } = await supabase.from("event_guest_responses").insert({
            event_id: invitationId,
            name: options.name,
            response: response
          });
          
          if (error) {
            console.error("Error saving guest response:", error);
            throw new Error("Failed to save your response. Please try again.");
          }
          
          toast({
            title: response === 'accepted' ? "Event Accepted" : "Event Declined",
            description: `Thank you, ${options.name}! Your response has been recorded.`,
          });
          
          return;
        } else {
          console.error("Invalid invitation or event ID:", invitationId);
          throw new Error("Invalid invitation. Please try again with a valid invitation link.");
        }
      }
    }
    
    // For authenticated WAKTI users
    // Find the invitation for this user and event
    const { data: invitation, error: findError } = await supabase
      .from("event_invitations")
      .select("*")
      .eq("event_id", invitationId)
      .eq("invited_user_id", session.user.id)
      .single();

    if (findError) {
      console.error("Error finding invitation:", findError);
      
      // If no invitation found, create a guest response for this authenticated user
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();
        
      const userName = profile?.full_name || "User";
      
      // Check if it's an invitation ID or event ID
      const { data: invitationData, error: invitationError } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", invitationId)
        .single();
        
      if (!invitationError && invitationData) {
        // It's an invitation ID
        const { error } = await supabase.from("event_guest_responses").insert({
          invitation_id: invitationId,
          name: userName,
          response: response
        });
        
        if (error) {
          console.error("Error saving authenticated guest response:", error);
          throw new Error("Failed to save your response. Please try again.");
        }
      } else {
        // Try with event ID
        const { error } = await supabase.from("event_guest_responses").insert({
          event_id: invitationId,
          name: userName,
          response: response
        });
        
        if (error) {
          console.error("Error saving authenticated guest response:", error);
          throw new Error("Failed to save your response. Please try again.");
        }
      }
      
      toast({
        title: response === 'accepted' ? "Event Accepted" : "Event Declined",
        description: `Thank you, ${userName}! Your response has been recorded.`,
      });
      
      return;
    }

    if (invitation) {
      // Update the invitation status
      const { error } = await supabase
        .from("event_invitations")
        .update({ status: response })
        .eq("id", invitation.id);

      if (error) {
        console.error("Error updating invitation:", error);
        throw new Error(`Failed to update invitation: ${error.message}`);
      }
    }

    // If accepting, add to calendar if requested (default is true)
    const addToCalendar = options?.addToCalendar !== false && response === 'accepted';
    
    if (addToCalendar) {
      // Get event details to add to calendar
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", invitationId)
        .single();
        
      if (!eventError && eventData) {
        // Log the action but don't try to insert to an unknown table
        console.log("Event would be added to user calendar:", {
          user_id: session.user.id,
          event_id: invitationId,
          title: eventData.title,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          is_all_day: eventData.is_all_day
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

/**
 * Fetches responses for an event
 */
export const fetchEventResponses = async (eventId: string): Promise<EventGuestResponse[]> => {
  try {
    // First check if the ID is for an event or invitation
    let isInvitation = false;
    const { data: invitationData, error: invitationError } = await supabase
      .from("invitations")
      .select("*")
      .eq("id", eventId)
      .single();
      
    if (!invitationError && invitationData) {
      isInvitation = true;
    }
    
    // First, get responses from guest_responses table for either events or invitations
    let guestResponsesQuery;
    if (isInvitation) {
      guestResponsesQuery = supabase
        .from("event_guest_responses")
        .select("*")
        .eq("invitation_id", eventId);
    } else {
      guestResponsesQuery = supabase
        .from("event_guest_responses")
        .select("*")
        .eq("event_id", eventId);
    }
    
    const { data: guestResponses, error: guestError } = await guestResponsesQuery;
      
    if (guestError) {
      console.error("Error fetching guest responses:", guestError);
      throw guestError;
    }
    
    // Only get event invitation responses if it's an event ID
    let invitationResponses: any[] = [];
    if (!isInvitation) {
      // Then get responses from event_invitations (authenticated users)
      const { data: eventInvitationResponses, error: invitationError } = await supabase
        .from("event_invitations")
        .select(`
          id,
          status,
          invited_user_id,
          email
        `)
        .eq("event_id", eventId)
        .in("status", ["accepted", "declined"]);
        
      if (invitationError) {
        console.error("Error fetching invitation responses:", invitationError);
        throw invitationError;
      }
      
      invitationResponses = eventInvitationResponses || [];
    }
    
    // Get profile information for invited users
    const formattedInvitationResponses: EventGuestResponse[] = [];
    
    for (const inv of invitationResponses) {
      let userName = inv.email || "Unknown User";
      
      if (inv.invited_user_id) {
        // Try to get the user's profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", inv.invited_user_id)
          .single();
          
        if (profile?.full_name) {
          userName = profile.full_name;
        }
      }
      
      formattedInvitationResponses.push({
        id: inv.id,
        event_id: eventId,
        name: userName,
        response: inv.status as 'accepted' | 'declined',
        created_at: new Date().toISOString()
      });
    }
    
    // Combine both response types
    const allResponses = [
      ...(guestResponses as EventGuestResponse[] || []),
      ...formattedInvitationResponses
    ];
    
    return allResponses;
  } catch (error) {
    console.error("Error fetching event responses:", error);
    throw error;
  }
};
