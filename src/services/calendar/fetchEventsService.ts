
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
    const allItems: CalendarEvent[] = [];
    
    // Get all regular events
    const events = await fetchEvents(userId);
    allItems.push(...events);
    
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
      
      allItems.push(...invitedCalendarEvents);
    }
    
    // Get tasks with due dates
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('id, title, due_date, status, priority')
      .eq('user_id', userId)
      .not('due_date', 'is', null);
    
    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
    } else if (tasksData) {
      const taskEvents: CalendarEvent[] = tasksData.map(task => ({
        id: task.id,
        title: task.title,
        date: new Date(task.due_date as string),
        type: 'task' as const,
        status: task.status,
        priority: task.priority
      }));
      
      allItems.push(...taskEvents);
    }
    
    // Get bookings (where user is customer or business)
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, title, start_time, status, description')
      .or(`customer_id.eq.${userId},business_id.eq.${userId},staff_assigned_id.eq.${userId}`);
      
    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
    } else if (bookingsData) {
      const bookingEvents: CalendarEvent[] = bookingsData.map(booking => ({
        id: booking.id,
        title: booking.title,
        date: new Date(booking.start_time as string),
        type: 'booking' as const,
        status: booking.status,
        description: booking.description
      }));
      
      allItems.push(...bookingEvents);
    }
    
    // Get manual calendar entries
    const { data: manualData, error: manualError } = await supabase
      .from('calendar_manual_entries')
      .select('*')
      .eq('user_id', userId);
      
    if (manualError) {
      console.error("Error fetching manual entries:", manualError);
    } else if (manualData) {
      const manualEvents: CalendarEvent[] = manualData.map(entry => ({
        id: entry.id,
        title: entry.title,
        date: new Date(entry.date),
        type: 'manual' as const,
        description: entry.description,
        location: entry.location
      }));
      
      allItems.push(...manualEvents);
    }
    
    console.log(`Total calendar items found: ${allItems.length}`);
    return allItems;
  } catch (error) {
    console.error("Error in fetchAllCalendarItems:", error);
    return [];
  }
};
