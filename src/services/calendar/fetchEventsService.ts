
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";
import { format } from "date-fns";

// Fetch events for calendar
export const fetchEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    console.log(`Fetching events for user: ${userId}`);
    
    // Fetch events from the events table
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id, title, start_time, end_time, location, description, status, is_all_day')
      .eq('user_id', userId);
    
    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      return [];
    }
    
    // Convert events to CalendarEvent format
    const calendarEvents: CalendarEvent[] = (eventsData || []).map(event => ({
      id: event.id,
      title: event.title,
      date: new Date(event.start_time),
      type: 'event' as const,
      status: event.status,
      description: event.description,
      location: event.location,
      isAllDay: event.is_all_day,
      endDate: event.end_time ? new Date(event.end_time) : undefined
    }));

    console.log(`Found ${calendarEvents.length} events in database`);
    return calendarEvents;
  } catch (error) {
    console.error("Error in fetchEvents:", error);
    return [];
  }
};

// Helper function to fetch all calendar items (events, tasks, bookings)
export const fetchAllCalendarItems = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    // Get all regular events
    const events = await fetchEvents(userId);
    
    // Get events that the user is invited to
    const { data: invitedEvents, error: invitedError } = await supabase
      .from('events')
      .select(`
        id, 
        title, 
        start_time, 
        end_time, 
        location, 
        description, 
        status,
        is_all_day,
        event_invitations!inner (*)
      `)
      .eq('event_invitations.invited_user_id', userId);
      
    if (invitedError) {
      console.error("Error fetching invited events:", invitedError);
    } else {
      // Add invited events to the results
      const invitedCalendarEvents: CalendarEvent[] = (invitedEvents || []).map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.start_time),
        type: 'event' as const,
        status: event.status,
        description: event.description,
        location: event.location,
        isAllDay: event.is_all_day,
        endDate: event.end_time ? new Date(event.end_time) : undefined
      }));
      
      events.push(...invitedCalendarEvents);
    }
    
    // Return combined results
    return events;
  } catch (error) {
    console.error("Error in fetchAllCalendarItems:", error);
    return [];
  }
};
