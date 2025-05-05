
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";

// Fetch events for calendar
export const fetchEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id, title, start_time, end_time, location, description, status')
      .eq('user_id', userId)
      .not('start_time', 'is', null);
    
    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      return [];
    }
    
    if (!eventsData || eventsData.length === 0) {
      return [];
    }
    
    return eventsData.map(event => ({
      id: event.id,
      title: event.title,
      date: new Date(event.start_time),
      type: 'event' as const,
      status: event.status || 'scheduled',
      location: event.location,
      description: event.description,
      startTime: event.start_time ? new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
      endTime: event.end_time ? new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    }));
  } catch (error) {
    console.error("Error in fetchEvents:", error);
    return [];
  }
};
