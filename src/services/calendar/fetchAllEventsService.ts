
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";
import { fetchTasks } from "./fetchTasksService";
import { fetchEvents } from "./fetchEventsService";
import { fetchManualEntries } from "./fetchManualEntriesService";

// Fetch all calendar events (tasks, events, bookings, manual entries)
export const fetchAllCalendarEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    if (!userId) return [];
    
    // Fetch from various data sources
    const [tasks, events, manualEntries] = await Promise.all([
      fetchTasks(userId),
      fetchEvents(userId),
      fetchManualEntries(userId)
    ]);
    
    // Fetch bookings if user is either customer or business
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, title, description, start_time, end_time')
      .or(`customer_id.eq.${userId},business_id.eq.${userId}`);
    
    let bookings: CalendarEvent[] = [];
    if (!bookingsError && bookingsData) {
      bookings = bookingsData.map(booking => ({
        id: booking.id,
        title: booking.title,
        description: booking.description || undefined,
        date: new Date(booking.start_time as string),
        start: new Date(booking.start_time as string),
        end: new Date(booking.end_time as string),
        type: 'booking' as const,
        color: '#0EA5E9' // Blue for bookings
      }));
    }
    
    // Combine all event types
    return [...tasks, ...events, ...bookings, ...manualEntries];
  } catch (error) {
    console.error("Error in fetchAllCalendarEvents:", error);
    return [];
  }
};
