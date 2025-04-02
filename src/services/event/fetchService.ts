
import { supabase } from '@/lib/supabase';
import { Event, EventsResult, EventStatus, EventTab } from '@/types/event.types';
import { transformDatabaseEvent } from './eventHelpers';
import { getUserProfile } from '@/services/profile';

/**
 * Fetches events based on the tab and filters
 */
export const fetchEvents = async (
  tab: EventTab,
  filters: {
    searchQuery?: string;
    filterStatus?: string;
    filterDate?: Date;
  } = {}
): Promise<EventsResult> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { events: [], userRole: 'free', canCreateEvents: false };
    }
    
    // Get user profile to check subscription
    const userProfile = await getUserProfile();
    const userRole = userProfile?.account_type || 'free';
    const canCreateEvents = userRole === 'individual' || userRole === 'business';
    
    // Start building the query based on the tab
    let query = supabase.from('events').select('*, invitations:event_invitations(*)');
    
    if (tab === 'my-events') {
      // User's own events
      query = query.eq('user_id', user.id);
      
      // Filter by status if provided
      if (filters.filterStatus && filters.filterStatus !== 'all') {
        query = query.eq('status', filters.filterStatus);
      } else {
        // Exclude drafts
        query = query.not('status', 'eq', 'draft');
      }
    } else if (tab === 'invited-events') {
      // Events where the user is invited
      query = supabase
        .from('event_invitations')
        .select('*, event:events(*)')
        .eq('invited_user_id', user.id)
        .order('created_at', { ascending: false });
      
      // Filter by status if provided
      if (filters.filterStatus && filters.filterStatus !== 'all') {
        query = query.eq('status', filters.filterStatus);
      }
    } else if (tab === 'draft-events') {
      // Draft events created by the user
      query = query
        .eq('user_id', user.id)
        .eq('status', 'draft');
    }
    
    // Add search filter if provided
    if (filters.searchQuery) {
      const searchTerm = `%${filters.searchQuery}%`;
      if (tab === 'invited-events') {
        // We're querying event_invitations, so use the event relation
        query = query.or(`event.title.ilike.${searchTerm},event.description.ilike.${searchTerm}`);
      } else {
        // We're querying events directly
        query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
      }
    }
    
    // Add date filter if provided
    if (filters.filterDate) {
      const date = filters.filterDate;
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const startISOString = startOfDay.toISOString();
      const endISOString = endOfDay.toISOString();
      
      if (tab === 'invited-events') {
        // Filter on event's start_time
        query = query.or(`event.start_time.gte.${startISOString},event.start_time.lte.${endISOString}`);
      } else {
        // Direct event query
        query = query.or(`start_time.gte.${startISOString},start_time.lte.${endISOString}`);
      }
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
    
    // Process the results
    let events: Event[] = [];
    
    if (tab === 'invited-events' && data) {
      // Extract events from invitations
      events = data
        .filter(invitation => invitation.event)
        .map(invitation => ({
          ...invitation.event,
          invitation_status: invitation.status,
          invitation_id: invitation.id
        }))
        .map(event => transformDatabaseEvent(event));
    } else if (data) {
      // Direct events
      events = data.map(event => transformDatabaseEvent(event));
    }
    
    return {
      events,
      userRole,
      canCreateEvents
    };
  } catch (error) {
    console.error("Error in fetchEvents:", error);
    return { events: [], userRole: 'free', canCreateEvents: false };
  }
};

/**
 * Fetches a single event by ID
 */
export const fetchEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to view events");
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*, invitations:event_invitations(*)')
      .eq('id', eventId)
      .single();
    
    if (error) {
      console.error("Error fetching event by ID:", error);
      throw error;
    }
    
    return transformDatabaseEvent(data);
  } catch (error) {
    console.error("Error in fetchEventById:", error);
    return null;
  }
};
