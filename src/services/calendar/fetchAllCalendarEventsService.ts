
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";
import { fetchTasks } from "./fetchTasksService";
import { fetchEvents } from "./fetchEventsService";

// Fetches all events from different sources (tasks, bookings, events)
export const fetchAllCalendarEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    // Get tasks
    const tasks = await fetchTasks(userId);
    
    // Get custom events
    const events = await fetchEvents(userId);
    
    // Get bookings
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, title, start_time, status')
      .or(`customer_id.eq.${userId},business_id.eq.${userId}`)
      .not('start_time', 'is', null);
    
    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      return [...tasks, ...events];
    }
    
    if (!bookingsData) {
      return [...tasks, ...events];
    }
    
    const bookings: CalendarEvent[] = bookingsData.map(booking => ({
      id: booking.id,
      title: booking.title,
      date: new Date(booking.start_time),
      type: 'booking' as const,
      status: booking.status
    }));
    
    // Combine all events
    return [...tasks, ...events, ...bookings];
  } catch (error) {
    console.error("Error in fetchAllCalendarEvents:", error);
    return [];
  }
};
