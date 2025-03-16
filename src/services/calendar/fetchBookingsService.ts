
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";

// Fetch bookings (for business accounts)
export const fetchBookings = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, title, start_time')
      .eq('status', 'scheduled'); // Or use another condition to identify bookings
    
    if (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(booking => ({
      id: booking.id,
      title: booking.title,
      date: new Date(booking.start_time),
      type: 'booking' as const
    }));
  } catch (error) {
    console.error("Error in fetchBookings:", error);
    return [];
  }
};
