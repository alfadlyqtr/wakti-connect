
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
    
    // First get the business_id for notification
    const { data: bookingData, error: fetchError } = await supabase
      .from('bookings')
      .select('business_id, title, staff_name, staff_assigned_id')
      .eq('id', bookingId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Update the booking
    const { error } = await supabase
      .from('bookings')
      .update({ 
        is_acknowledged: true,
        acknowledged_at: now,
        updated_at: now,
        status: 'in_progress' // Add a new status for acknowledged bookings
      })
      .eq('id', bookingId);
      
    if (error) throw error;
    
    // Send notification to the business owner
    if (bookingData?.business_id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: bookingData.business_id,
          title: "Booking Acknowledged",
          content: `Staff ${bookingData.staff_name || 'member'} has acknowledged the booking: ${bookingData.title}`,
          type: "booking_acknowledgment",
          related_entity_id: bookingId,
          related_entity_type: "booking"
        });
    }
    
    return true;
  } catch (error) {
    console.error("Error acknowledging booking:", error);
    return false;
  }
};

/**
 * Mark a booking as no-show (requires business approval)
 */
export const markBookingNoShow = async (bookingId: string): Promise<boolean> => {
  try {
    // Use the database function to mark the booking as no-show
    const { data, error } = await supabase
      .rpc('mark_booking_no_show', { booking_id_param: bookingId });
      
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error("Error marking booking as no-show:", error);
    return false;
  }
};

/**
 * Approve a no-show booking (business owners only)
 */
export const approveNoShow = async (bookingId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('approve_no_show', { booking_id_param: bookingId });
      
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error("Error approving no-show:", error);
    return false;
  }
};

/**
 * Reject a no-show booking (business owners only)
 */
export const rejectNoShow = async (bookingId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('reject_no_show', { booking_id_param: bookingId });
      
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error("Error rejecting no-show:", error);
    return false;
  }
};
