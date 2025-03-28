
import { supabase } from "@/integrations/supabase/client";
import { BookingStatus, BookingUpdateData } from "@/types/booking.types";

/**
 * Update a booking status
 */
export const updateBookingStatus = async (
  bookingId: string, 
  status: BookingStatus
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', bookingId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return false;
  }
};

/**
 * Update a booking with multiple fields
 */
export const updateBooking = async (
  bookingId: string,
  data: BookingUpdateData
): Promise<boolean> => {
  try {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating booking:", error);
    return false;
  }
};

/**
 * Acknowledge a booking (mark it as acknowledged by staff)
 */
export const acknowledgeBooking = async (bookingId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('bookings')
      .update({ 
        is_acknowledged: true,
        acknowledged_at: now,
        updated_at: now
      })
      .eq('id', bookingId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error acknowledging booking:", error);
    return false;
  }
};
