
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";

// Fetch events for calendar
export const fetchEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    console.log(`Fetching events for user: ${userId}`);
    
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id, title, start_time, location, description, status')
      .eq('user_id', userId);
    
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
      date: new Date(event.start_time as string),
      type: 'event' as const,
      status: event.status,
      description: event.description,
      location: event.location
    }));
  } catch (error) {
    console.error("Error in fetchEvents:", error);
    return [];
  }
};
