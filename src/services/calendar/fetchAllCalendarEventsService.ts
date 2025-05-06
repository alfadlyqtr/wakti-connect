
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";
import { fetchTasks } from "./fetchTasksService";
import { fetchEvents } from "./fetchEventsService";

// Fetches all events from different sources (tasks, bookings, events)
export const fetchAllCalendarEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    // Get tasks
    const tasks = await fetchTasks(userId);
    
    // Get events (including manual entries)
    const events = await fetchEvents(userId);
    
    // Get manual entries
    const { data: manualData, error: manualError } = await supabase
      .from('calendar_manual_entries')
      .select('id, title, description, date, location, start_time, end_time')
      .eq('user_id', userId);
      
    if (manualError) {
      console.error("Error fetching manual entries:", manualError);
      return [...tasks, ...events];
    }
    
    const manualEntries: CalendarEvent[] = manualData?.map(entry => ({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      date: new Date(entry.date),
      type: 'manual' as const,
      location: entry.location,
      startTime: entry.start_time,
      endTime: entry.end_time
    })) || [];
    
    // Get bookings
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, title, start_time, status')
      .or(`customer_id.eq.${userId},business_id.eq.${userId}`)
      .not('start_time', 'is', null);
    
    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      return [...tasks, ...events, ...manualEntries];
    }
    
    if (!bookingsData) {
      return [...tasks, ...events, ...manualEntries];
    }
    
    const bookings: CalendarEvent[] = bookingsData.map(booking => ({
      id: booking.id,
      title: booking.title,
      date: new Date(booking.start_time),
      type: 'booking' as const,
      status: booking.status
    }));
    
    // Get reminders
    const { data: remindersData, error: remindersError } = await supabase
      .from('reminders')
      .select('id, message, reminder_time')
      .eq('user_id', userId)
      .eq('is_active', true);
      
    if (remindersError) {
      console.error("Error fetching reminders:", remindersError);
      return [...tasks, ...events, ...manualEntries, ...bookings];
    }
    
    const reminders: CalendarEvent[] = remindersData?.map(reminder => ({
      id: reminder.id,
      title: reminder.message,
      date: new Date(reminder.reminder_time),
      type: 'reminder' as const
    })) || [];
    
    // Combine all events
    return [...tasks, ...events, ...manualEntries, ...bookings, ...reminders];
  } catch (error) {
    console.error("Error in fetchAllCalendarEvents:", error);
    return [];
  }
};
