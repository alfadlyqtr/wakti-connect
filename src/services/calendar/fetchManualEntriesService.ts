
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";

// Fetch manual entries for calendar
export const fetchManualEntries = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data: entriesData, error: entriesError } = await supabase
      .from('calendar_manual_entries')
      .select('id, title, description, date, location')
      .eq('user_id', userId);
    
    if (entriesError) {
      console.error("Error fetching manual entries:", entriesError);
      return [];
    }
    
    if (!entriesData || entriesData.length === 0) {
      return [];
    }
    
    return entriesData.map(entry => ({
      id: entry.id,
      title: entry.title,
      description: entry.description || undefined,
      date: new Date(entry.date as string),
      location: entry.location || undefined,
      type: 'manual' as const,
      color: '#F97316' // Orange for manual entries
    }));
  } catch (error) {
    console.error("Error in fetchManualEntries:", error);
    return [];
  }
};
