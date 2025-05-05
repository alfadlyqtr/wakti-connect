
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";

export const fetchEvents = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    // Fetch calendar events from the database
    const { data: eventsData, error: eventsError } = await supabase
      .from('calendar_events')
      .select('id, title, description, date, status, location')
      .eq('user_id', userId);
    
    if (eventsError) {
      console.error("Error fetching calendar events:", eventsError);
      return [];
    }
    
    // Fetch manual entries
    const { data: manualData, error: manualError } = await supabase
      .from('calendar_manual_entries')
      .select('id, title, description, date, location')
      .eq('user_id', userId);
    
    if (manualError) {
      console.error("Error fetching manual entries:", manualError);
      return eventsData ? eventsData.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        type: "event" as const,
        status: event.status,
        location: event.location
      })) : [];
    }
    
    // Convert events data
    const events: CalendarEvent[] = (eventsData || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      type: "event" as const,
      status: event.status,
      location: event.location
    }));
    
    // Convert manual entries 
    const manualEntries: CalendarEvent[] = (manualData || []).map(entry => ({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      date: new Date(entry.date),
      type: "manual" as const,
      location: entry.location
    }));
    
    // Combine both types of events
    return [...events, ...manualEntries];
  } catch (error) {
    console.error("Error in fetchEvents:", error);
    return [];
  }
};
