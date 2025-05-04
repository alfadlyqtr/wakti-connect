
import { supabase } from "@/integrations/supabase/client";
import { EventGuestResponse } from "@/types/event-guest-response.types";
import { createGoogleCalendarUrl, createICSFile } from "./createICSFile";
import { toast } from "@/components/ui/use-toast";

// Main export for responding to invitations with type casting for non-authenticated users
export const respondToInvitation = async (
  id: string,
  response: 'accepted' | 'declined',
  options?: { 
    name?: string; 
    addToCalendar?: boolean;
  }
): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Handle case for authenticated users
    if (session?.user) {
      return await handleAuthenticatedUserResponse(id, response, options?.addToCalendar);
    }
    
    // Handle case for non-authenticated users
    if (options?.name) {
      return await handleNonAuthenticatedUserResponse(id, response as 'accepted' | 'declined', options.name);
    }
    
    throw new Error("Either authentication or a name is required to respond to an invitation");
  } catch (error) {
    console.error("Error responding to invitation:", error);
    throw error;
  }
};

// Handle responses from authenticated users
const handleAuthenticatedUserResponse = async (
  id: string,
  response: 'accepted' | 'declined',
  addToCalendar?: boolean
): Promise<boolean> => {
  const isInvitation = id.includes('inv_') || id.length === 36; // UUID format check
  
  try {
    if (isInvitation) {
      // This is an invitation ID, update the invitation status
      const { error } = await supabase
        .from('event_invitations')
        .update({ status: response })
        .eq('id', id);
      
      if (error) throw error;
    } else {
      // This is an event ID, find the user's invitation for this event
      const { data: invitation, error: fetchError } = await supabase
        .from('event_invitations')
        .select('id')
        .eq('event_id', id)
        .eq('invited_user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (!invitation) {
        // No existing invitation, create a guest response instead
        const { error } = await supabase
          .from('event_guest_responses')
          .insert({
            event_id: id,
            name: (await supabase.auth.getUser()).data.user?.email || 'Unknown User',
            response: response
          });
        
        if (error) throw error;
      } else {
        // Update the existing invitation
        const { error } = await supabase
          .from('event_invitations')
          .update({ status: response })
          .eq('id', invitation.id);
        
        if (error) throw error;
      }
    }
    
    // If the user accepted and wants to add to calendar, handle that
    if (response === 'accepted' && addToCalendar) {
      // Get the event details to create calendar entry
      const event = isInvitation
        ? await getEventByInvitationId(id)
        : await getEventById(id);
      
      if (event) {
        // Add to calendar logic (if we have event data)
        const startDate = new Date(event.start_time);
        const endDate = new Date(event.end_time);
        
        createICSFile({
          title: event.title,
          description: event.description,
          location: event.location,
          start: startDate,
          end: endDate
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error handling ${isInvitation ? 'invitation' : 'event'} response:`, error);
    throw error;
  }
};

// Handle responses from non-authenticated users
const handleNonAuthenticatedUserResponse = async (
  id: string,
  response: 'accepted' | 'declined',
  name: string
): Promise<boolean> => {
  const isInvitation = id.includes('inv_') || id.length === 36; // UUID format check
  
  try {
    // Save the guest response
    const { error } = await supabase
      .from('event_guest_responses')
      .insert({
        event_id: isInvitation ? undefined : id,
        invitation_id: isInvitation ? id : undefined,
        name,
        response
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving guest response:", error);
    throw error;
  }
};

// Get event details by event ID
const getEventById = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, description, start_time, end_time, location')
    .eq('id', eventId)
    .single();
  
  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }
  
  return data;
};

// Get event details by invitation ID
const getEventByInvitationId = async (invitationId: string) => {
  const { data, error } = await supabase
    .from('event_invitations')
    .select('event:event_id(id, title, description, start_time, end_time, location)')
    .eq('id', invitationId)
    .single();
  
  if (error) {
    console.error("Error fetching event by invitation:", error);
    return null;
  }
  
  return data?.event;
};

// Fetch responses for an event
export const fetchEventResponses = async (id: string): Promise<EventGuestResponse[]> => {
  try {
    const isInvitation = id.includes('inv_') || id.length === 36; // UUID format check
    
    let responses: EventGuestResponse[] = [];
    
    // First, check for registered user responses via invitations
    if (isInvitation) {
      // Get the event ID from the invitation
      const { data: invitationData, error: invError } = await supabase
        .from('event_invitations')
        .select('event_id')
        .eq('id', id)
        .single();
      
      if (invError) {
        console.error("Error fetching invitation:", invError);
      } else if (invitationData?.event_id) {
        // Get all invitations for the same event
        const { data: invitationsData, error: invsError } = await supabase
          .from('event_invitations')
          .select('id, invited_user_id, email, status, created_at, profiles:invited_user_id(full_name, display_name, email)')
          .eq('event_id', invitationData.event_id);
        
        if (!invsError && invitationsData) {
          responses = invitationsData.map(inv => ({
            id: inv.id,
            event_id: invitationData.event_id,
            name: inv.profiles?.display_name || inv.profiles?.full_name || inv.email || 'Unknown',
            response: inv.status as 'accepted' | 'declined', // Type assertion here
            created_at: inv.created_at
          }));
        }
        
        // Also get non-authenticated guest responses for this event
        const { data: guestData, error: guestError } = await supabase
          .from('event_guest_responses')
          .select('*')
          .eq('event_id', invitationData.event_id);
        
        if (!guestError && guestData) {
          const guestResponses = guestData.map(guest => ({
            id: guest.id,
            event_id: guest.event_id,
            invitation_id: guest.invitation_id,
            name: guest.name,
            response: guest.response as 'accepted' | 'declined', // Type assertion here
            created_at: guest.created_at
          }));
          
          responses = [...responses, ...guestResponses];
        }
      }
      
      // Get direct responses to this invitation ID
      const { data: directResponses, error: directError } = await supabase
        .from('event_guest_responses')
        .select('*')
        .eq('invitation_id', id);
        
      if (!directError && directResponses) {
        const formattedResponses = directResponses.map(resp => ({
          id: resp.id,
          event_id: resp.event_id,
          invitation_id: resp.invitation_id,
          name: resp.name,
          response: resp.response as 'accepted' | 'declined', // Type assertion here
          created_at: resp.created_at
        }));
        
        responses = [...responses, ...formattedResponses];
      }
    } else {
      // This is an event ID, get all responses for this event
      
      // Get registered user responses via invitations
      const { data: invitationsData, error: invsError } = await supabase
        .from('event_invitations')
        .select('id, invited_user_id, email, status, created_at, profiles:invited_user_id(full_name, display_name, email)')
        .eq('event_id', id);
      
      if (!invsError && invitationsData) {
        responses = invitationsData.map(inv => ({
          id: inv.id,
          event_id: id,
          name: inv.profiles?.display_name || inv.profiles?.full_name || inv.email || 'Unknown',
          response: inv.status as 'accepted' | 'declined', // Type assertion here
          created_at: inv.created_at
        }));
      }
      
      // Get non-authenticated guest responses
      const { data: guestData, error: guestError } = await supabase
        .from('event_guest_responses')
        .select('*')
        .eq('event_id', id);
      
      if (!guestError && guestData) {
        const guestResponses = guestData.map(guest => ({
          id: guest.id,
          event_id: guest.event_id,
          invitation_id: guest.invitation_id,
          name: guest.name,
          response: guest.response as 'accepted' | 'declined', // Type assertion here
          created_at: guest.created_at
        }));
        
        responses = [...responses, ...guestResponses];
      }
    }
    
    return responses;
  } catch (error) {
    console.error("Error fetching event responses:", error);
    return [];
  }
};
