
import { supabase } from '@/integrations/supabase/client';
import { Event, EventTab, EventsResult } from '@/types/event.types';
import { getUserRole } from '@/services/profile/userService';

// Fetch events based on the active tab
export const fetchEvents = async (activeTab: EventTab): Promise<EventsResult> => {
  try {
    // Check if the user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error('You must be logged in to view events');
    }
    
    const userId = sessionData.session.user.id;
    let events: Event[] = [];
    
    // Get the user's role to determine if they can create events
    const userRole = await getUserRole(userId);
    const canCreateEvents = userRole === 'individual' || userRole === 'business';
    
    // Fetch events based on the active tab
    switch (activeTab) {
      case 'my-events':
        events = await fetchMyEvents(userId);
        break;
      case 'invited-events':
        events = await fetchInvitedEvents(userId);
        break;
      case 'draft-events':
        events = await fetchDraftEvents(userId);
        break;
      default:
        events = await fetchMyEvents(userId);
    }
    
    return {
      events,
      userRole,
      canCreateEvents
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Fetch events created by the user
const fetchMyEvents = async (userId: string): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        invitations:event_invitations(*)
      `)
      .eq('user_id', userId)
      .neq('status', 'draft')
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching my events:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchMyEvents:', error);
    throw error;
  }
};

// Fetch events where the user is invited
const fetchInvitedEvents = async (userId: string): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('event_invitations')
      .select(`
        *,
        event:events(*)
      `)
      .eq('invited_user_id', userId)
      .not('status', 'eq', 'draft')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching invited events:', error);
      throw error;
    }
    
    // Transform the data to match the Event interface
    const events = data
      .map(invitation => invitation.event)
      .filter(event => event !== null) as Event[];
    
    return events;
  } catch (error) {
    console.error('Error in fetchInvitedEvents:', error);
    throw error;
  }
};

// Fetch draft events created by the user
const fetchDraftEvents = async (userId: string): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        invitations:event_invitations(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'draft')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching draft events:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchDraftEvents:', error);
    throw error;
  }
};

// Fetch a single event by ID
export const fetchEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        invitations:event_invitations(*)
      `)
      .eq('id', eventId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Event not found
      }
      console.error('Error fetching event by ID:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchEventById:', error);
    throw error;
  }
};

// Get results when no events are available
export const getEmptyEventsResult = async (): Promise<EventsResult> => {
  try {
    // Check if the user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error('You must be logged in to view events');
    }
    
    const userId = sessionData.session.user.id;
    
    // Get the user's role to determine if they can create events
    const userRole = await getUserRole(userId);
    const canCreateEvents = userRole === 'individual' || userRole === 'business';
    
    return {
      events: [],
      userRole,
      canCreateEvents
    };
  } catch (error) {
    console.error('Error in getEmptyEventsResult:', error);
    return {
      events: [],
      userRole: 'free',
      canCreateEvents: false
    };
  }
};
