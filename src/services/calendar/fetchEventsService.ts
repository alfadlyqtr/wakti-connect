
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";

// Fetch events for calendar
export const fetchEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id, title, description, start_time, end_time, location, is_all_day')
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
      description: event.description || undefined,
      date: new Date(event.start_time as string),
      start: new Date(event.start_time as string),
      end: new Date(event.end_time as string),
      location: event.location || undefined,
      type: 'event' as const,
      color: '#8B5CF6' // Purple for events
    }));
  } catch (error) {
    console.error("Error in fetchEvents:", error);
    return [];
  }
};
