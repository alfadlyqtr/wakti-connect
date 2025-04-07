
// This is a stub file that needs to be completed.
// For now, just adding enough code to fix the type errors
import { supabase } from '@/lib/supabase';
import { Event, EventWithInvitations, EventsResult } from '@/types/event.types';
import { convertToTypedEvents, convertToTypedEvent } from '@/utils/typeAdapters';

// Fetch events by user and tab
export const getEvents = async (tab: 'my-events' | 'invited-events' | 'draft-events'): Promise<EventsResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error("No authenticated user found");
      return { events: [], userRole: 'free', canCreateEvents: false };
    }

    let query;
    
    if (tab === 'my-events') {
      query = supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
    } else if (tab === 'invited-events') {
      query = supabase
        .from('event_invitations')
        .select('event:event_id(*)')
        .eq('invited_user_id', user.id)
        .order('created_at', { ascending: false });
    } else if (tab === 'draft-events') {
      query = supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'draft')
        .order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }

    let events: Event[] = [];

    if (tab === 'invited-events' && data) {
      // Extract events from invitation data
      events = convertToTypedEvents(data.filter(item => item.event).map(item => item.event));
    } else if (data) {
      // Direct events data
      events = convertToTypedEvents(data);
    }

    // Get user role
    const { data: profileData } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .single();

    // Use type assertion to restrict the account_type to the expected values
    const userRole = (profileData?.account_type || 'free') as 'free' | 'individual' | 'business';
    
    // Determine if user can create events (individual or business accounts)
    const canCreateEvents = userRole === 'individual' || userRole === 'business';

    return {
      events,
      userRole,
      canCreateEvents
    };
  } catch (error) {
    console.error("Error in getEvents:", error);
    return { events: [], userRole: 'free', canCreateEvents: false };
  }
};

// Get event by ID
export const getEventById = async (eventId: string): Promise<EventWithInvitations | null> => {
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
      console.error("Error fetching event:", error);
      throw error;
    }

    if (!data) {
      return null;
    }

    // Convert to properly typed event
    const typedEvent = convertToTypedEvent(data);
    
    // Add invitations and return as EventWithInvitations
    return {
      ...typedEvent,
      invitations: data.invitations || []
    } as EventWithInvitations;
  } catch (error) {
    console.error("Error in getEventById:", error);
    return null;
  }
};
