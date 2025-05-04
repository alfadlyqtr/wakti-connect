
import { supabase } from "@/integrations/supabase/client";
import { EventGuestResponse } from "@/types/event-guest-response.types";
import { createICSFile, createGoogleCalendarUrl } from "./createICSFile";

/**
 * Respond to an event invitation
 * @param id - This can be either an event_id or an invitation_id
 * @param response - The response ('accepted' or 'declined')
 * @param options - Additional options for the response
 */
export const respondToInvitation = async (
  id: string,
  response: 'accepted' | 'declined',
  options: {
    name?: string;
    addToCalendar?: boolean;
  } = {}
): Promise<boolean> => {
  try {
    // First check if this is an authenticated user
    const { data: { session } } = await supabase.auth.getSession();
    
    // If we're using an event ID directly
    if (!options.name) {
      if (!session?.user) {
        throw new Error("Authentication required to respond to invitations without providing a name");
      }
      
      // For authenticated users, update the invitation record if it exists
      const { data: invitationData, error: invitationError } = await supabase
        .from('event_invitations')
        .select('id')
        .eq('event_id', id)
        .eq('invited_user_id', session.user.id)
        .single();
        
      if (!invitationError && invitationData) {
        // Update the invitation status
        const { error: updateError } = await supabase
          .from('event_invitations')
          .update({ status: response })
          .eq('id', invitationData.id);
          
        if (updateError) {
          console.error("Error updating invitation:", updateError);
          throw updateError;
        }
        
        return true;
      }
      
      // If no invitation found or there was an error, create a direct response
      const { error } = await supabase
        .from('event_guest_responses')
        .insert({
          event_id: id,
          name: session.user.email || 'Anonymous',
          response
        });
        
      if (error) {
        console.error("Error responding to event:", error);
        throw error;
      }
      
      return true;
    } else {
      // For non-authenticated users or when a name is provided
      
      // First, check if this is an invitation ID
      const { data: invitationData, error: invitationError } = await supabase
        .from('event_invitations')
        .select('id, event_id')
        .eq('id', id)
        .maybeSingle();
      
      if (!invitationError && invitationData) {
        // This is an invitation ID, so insert a response with the invitation_id
        const { error } = await supabase
          .from('event_guest_responses')
          .insert({
            invitation_id: id,
            event_id: invitationData.event_id,
            name: options.name,
            response
          });
          
        if (error) {
          console.error("Error responding to invitation:", error);
          throw error;
        }
        
        // If this is for an invitation, also update the invitation status if it has an event_id
        if (invitationData.event_id) {
          const { error: updateError } = await supabase
            .from('event_invitations')
            .update({ status: response })
            .eq('id', id);
            
          if (updateError) {
            console.error("Error updating invitation status:", updateError);
            // Don't throw here, since we already recorded the response
          }
        }
        
        return true;
      }
      
      // If it's not an invitation ID or no invitation was found, treat it as an event ID
      const { error } = await supabase
        .from('event_guest_responses')
        .insert({
          event_id: id,
          name: options.name || 'Anonymous',
          response
        });
        
      if (error) {
        console.error("Error responding to event:", error);
        throw error;
      }
      
      return true;
    }
  } catch (error: any) {
    console.error('Error in respondToInvitation:', error);
    throw error;
  }
};

/**
 * Add to calendar feature
 */
export const addToCalendar = async (
  id: string,
  calendarType: 'google' | 'ics' = 'google'
): Promise<void> => {
  try {
    // First, determine if this is an event ID or an invitation ID
    let eventData;
    
    // Try to get event data directly first
    const { data: directEventData, error: directEventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (!directEventError && directEventData) {
      eventData = directEventData;
    } else {
      // If not found directly, check if it's an invitation ID
      const { data: invitationData, error: invitationError } = await supabase
        .from('event_invitations')
        .select('event:event_id(*)')
        .eq('id', id)
        .maybeSingle();
        
      if (!invitationError && invitationData && invitationData.event) {
        eventData = invitationData.event;
      }
    }
    
    if (!eventData) {
      throw new Error("Event not found");
    }
    
    // Format the event for calendar
    const event = {
      title: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start: new Date(eventData.start_time),
      end: new Date(eventData.end_time)
    };
    
    if (calendarType === 'google') {
      const url = createGoogleCalendarUrl(event);
      window.open(url, '_blank');
    } else {
      createICSFile(event);
    }
  } catch (error) {
    console.error("Error adding event to calendar:", error);
    throw error;
  }
};

/**
 * Fetch responses for an event
 */
export const fetchEventResponses = async (id: string): Promise<EventGuestResponse[]> => {
  try {
    // First, check if this is an invitation ID
    const { data: invitationData, error: invitationError } = await supabase
      .from('event_invitations')
      .select('event_id')
      .eq('id', id)
      .maybeSingle();
      
    let eventId = id;
    
    // If this is an invitation ID and it has an event_id, use that for querying responses
    if (!invitationError && invitationData && invitationData.event_id) {
      eventId = invitationData.event_id;
    }
    
    // Get direct responses linked to the event
    const { data: directResponses, error: directError } = await supabase
      .from('event_guest_responses')
      .select('*')
      .eq('event_id', eventId);
      
    if (directError) {
      console.error("Error fetching direct responses:", directError);
      throw directError;
    }
    
    // Get responses linked to the invitation
    const { data: invitationResponses, error: invResponsesError } = await supabase
      .from('event_guest_responses')
      .select('*')
      .eq('invitation_id', id);
      
    if (invResponsesError) {
      console.error("Error fetching invitation responses:", invResponsesError);
      // Don't throw, just continue with what we have
    }
    
    // Also get invitation statuses for this event
    const { data: invitations, error: invError } = await supabase
      .from('event_invitations')
      .select('id, email, invited_user_id, status, created_at')
      .eq('event_id', eventId);
      
    if (invError) {
      console.error("Error fetching invitations:", invError);
      // Don't throw, just continue with what we have
    }
    
    // Combine all responses
    const allResponses: EventGuestResponse[] = [
      ...(directResponses || []),
      ...(invitationResponses || [])
    ];
    
    // Add invitation statuses as responses if they don't already exist
    if (invitations && invitations.length > 0) {
      // Get emails of users who already responded
      const existingEmails = new Set(
        allResponses.map(r => r.name.toLowerCase())
      );
      
      // Add invitations as responses if they have a status and are not duplicates
      invitations.forEach(inv => {
        if (inv.status !== 'pending' && inv.email && !existingEmails.has(inv.email.toLowerCase())) {
          allResponses.push({
            id: inv.id,
            name: inv.email,
            response: inv.status as 'accepted' | 'declined',
            created_at: inv.created_at
          });
          existingEmails.add(inv.email.toLowerCase());
        }
      });
    }
    
    // Remove any duplicates based on name (case insensitive)
    const uniqueResponses = allResponses.reduce((acc, current) => {
      const nameKey = current.name.toLowerCase();
      const existing = acc.find(item => item.name.toLowerCase() === nameKey);
      
      if (!existing) {
        acc.push(current);
      }
      
      return acc;
    }, [] as EventGuestResponse[]);
    
    return uniqueResponses;
  } catch (error) {
    console.error("Error fetching responses:", error);
    throw error;
  }
};
