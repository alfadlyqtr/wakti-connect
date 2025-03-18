
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes a booking
 */
export const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    // Get the current user's ID for permission check
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      throw new Error("Authentication required to delete bookings");
    }
    
    // Check if user owns the booking (is the business owner)
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('business_id')
      .eq('id', bookingId)
      .single();
      
    if (bookingError) throw bookingError;
    
    if (bookingData.business_id !== session.user.id) {
      throw new Error("You don't have permission to delete this booking");
    }
    
    // Delete the booking
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) throw error;
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
