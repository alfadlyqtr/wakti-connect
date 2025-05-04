
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
  id: string,
  response: 'accepted' | 'declined',
  options: RespondOptions = {}
): Promise<boolean> => {
  const { name, addToCalendar } = options;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    let isInvitation = false;
    let eventId = id;
    let invitationId = null;
    
    // First check if the ID is for an invitation or an event
    const { data: invitation, error: invitationError } = await supabase
      .from('event_invitations')
      .select('id, event_id')
      .eq('id', id)
      .maybeSingle();
      
    if (invitation) {
      isInvitation = true;
      eventId = invitation.event_id;
      invitationId = invitation.id;
    }
    
    if (session?.user) {
      // Authenticated user flow
      if (isInvitation) {
        // Update the invitation status for authenticated users
        const { error } = await supabase
          .from('event_invitations')
          .update({ status: response })
          .eq('id', invitationId)
          .eq('invited_user_id', session.user.id);
          
        if (error) throw error;
      }
      
      // Also record the response in event_guest_responses
      const { error } = await supabase
        .from('event_guest_responses')
        .insert({
          event_id: eventId,
          invitation_id: invitationId,
          name: name || session.user.id,
          response
        });
        
      if (error) throw error;
    } else {
      // Non-authenticated user flow
      if (!name) {
        throw new Error("Name is required for non-authenticated users");
      }
      
      // Record response in event_guest_responses for non-auth users
      const { error } = await supabase
        .from('event_guest_responses')
        .insert({
          event_id: eventId, 
          invitation_id: invitationId,
          name,
          response
        });
        
      if (error) throw error;
    }
    
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
        user_id,
        profiles:user_id (
          full_name,
          display_name
        )
      `)
      .eq('id', eventId)
      .single();
    
    if (error) throw error;
    
    if (!event) return null;
    
    // Get responses for the event
    const responses = await fetchEventResponses(eventId);
    
    // Handle profiles data safely with null checks and optional chaining
    const profileData = event.profiles as { full_name?: string, display_name?: string } | null;
    const sender_name = profileData?.display_name || profileData?.full_name || 'Event Organizer';
    
    return {
      ...event,
      sender_name,
      guest_responses: responses
    };
  } catch (error) {
    console.error("Error fetching event with responses:", error);
    return null;
  }
};

/**
 * Fetch responses for an event or invitation
 */
export const fetchEventResponses = async (id: string): Promise<EventGuestResponse[]> => {
  try {
    // First check if the ID is for an invitation or an event
    const { data: invitation, error: invitationError } = await supabase
      .from('event_invitations')
      .select('id, event_id')
      .eq('id', id)
      .maybeSingle();
      
    const eventId = invitation?.event_id || id;
    const invitationId = invitation?.id || null;
    
    let query = supabase
      .from('event_guest_responses')
      .select('*');
    
    // If we have an invitation ID, filter by it; otherwise filter by event ID  
    if (invitationId) {
      query = query.eq('invitation_id', invitationId);
    } else {
      query = query.eq('event_id', eventId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      // Try to get responses from event_invitations if no direct responses found
      const { data: invitationResponses, error: invError } = await supabase
        .from('event_invitations')
        .select(`
          id, 
          status, 
          invited_user_id,
          email,
          profiles:invited_user_id (
            display_name,
            full_name,
            email
          )
        `)
        .eq('event_id', eventId)
        .not('status', 'eq', 'pending');
        
      if (invError) throw invError;
      
      if (invitationResponses && invitationResponses.length > 0) {
        return invitationResponses.map(inv => {
          // Safely handle profiles data with type assertions and null checks
          const profileData = inv.profiles as { display_name?: string, full_name?: string, email?: string } | null;
          const name = profileData ? 
            (profileData.display_name || profileData.full_name || profileData.email || `Guest-${inv.id.substring(0, 6)}`) : 
            (inv.email || `Guest-${inv.id.substring(0, 6)}`);
            
          return {
            id: inv.id,
            event_id: eventId,
            invitation_id: inv.id,
            name,
            response: inv.status as 'accepted' | 'declined'
          };
        });
      }
      
      return [];
    }
    
    // Convert to expected format and ensure response is correctly typed
    return data.map(response => ({
      id: response.id,
      event_id: response.event_id,
      invitation_id: response.invitation_id,
      name: response.name,
      response: response.response as 'accepted' | 'declined',
      created_at: response.created_at
    }));
  } catch (error) {
    console.error("Error fetching invitation:", error);
    throw error;
  }
};
