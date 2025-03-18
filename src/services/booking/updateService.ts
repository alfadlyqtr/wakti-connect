
import { supabase } from "@/integrations/supabase/client";
import { BookingStatus } from "@/types/booking.types";

/**
 * Updates a booking's status
 */
export const updateBookingStatus = async (
  bookingId: string,
  status: string
): Promise<void> => {
  try {
    // Get the current user's ID for permission check
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      throw new Error("Authentication required to update bookings");
    }
    
    // Check if user owns the booking (is the business owner)
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('business_id')
      .eq('id', bookingId)
      .single();
      
    if (bookingError) throw bookingError;
    
    if (bookingData.business_id !== session.user.id) {
      throw new Error("You don't have permission to update this booking");
    }
    
    // Update the booking status
    const { error } = await supabase
      .from('bookings')
      .update({ 
        status: status as BookingStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (error) throw error;
  } catch (error: any) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};
