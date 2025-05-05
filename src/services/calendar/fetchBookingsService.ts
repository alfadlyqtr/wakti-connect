
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";

// Fetch bookings for calendar display
export const fetchBookings = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    console.log(`Fetching bookings for user: ${userId}`);
    
    // First check if user is a business owner
    const { data: profileData } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', userId)
      .single();
      
    const isBusiness = profileData?.account_type === 'business';
    
    let bookingsQuery;
    
    if (isBusiness) {
      // If business owner, fetch all bookings for their business
      bookingsQuery = supabase
        .from('bookings')
        .select('id, title, start_time, business_id, status, description, staff_assigned_id')
        .eq('business_id', userId);
    } else {
      // If staff or individual user, fetch bookings where they are assigned
      bookingsQuery = supabase
        .from('bookings')
        .select('id, title, start_time, business_id, status, description, staff_assigned_id')
        .eq('staff_assigned_id', userId);
    }
    
    const { data: bookingsData, error } = await bookingsQuery;
    
    if (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
    
    if (!bookingsData || bookingsData.length === 0) {
      return [];
    }
    
    // Map booking data to CalendarEvent format
    const bookingEvents: CalendarEvent[] = bookingsData.map(booking => ({
      id: booking.id,
      title: booking.title,
      date: new Date(booking.start_time),
      type: 'booking' as const,
      status: booking.status,
      description: booking.description
    }));
    
    return bookingEvents;
  } catch (error) {
    console.error("Error in fetchBookings:", error);
    return [];
  }
};
