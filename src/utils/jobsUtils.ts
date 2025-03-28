
import { supabase } from "@/integrations/supabase/client";
import { BookingWithRelations } from "@/types/booking.types";
import { JobCardFormData } from "@/types/jobs.types";

/**
 * Check if the current user is a business owner
 */
export const isBusinessOwner = async (): Promise<boolean> => {
  try {
    // Call the Supabase function to check the user's role
    const { data, error } = await supabase.rpc('get_user_role');
    
    if (error) {
      console.error("Error checking if user is business owner:", error);
      return false;
    }
    
    return data === 'business';
  } catch (error) {
    console.error("Error in isBusinessOwner:", error);
    return false;
  }
};

/**
 * Create a job card from a booking
 */
export const createJobCardFromBooking = async (
  booking: BookingWithRelations,
  staffRelationId: string
): Promise<boolean> => {
  try {
    if (!booking.id || !staffRelationId) {
      console.error("Missing required data for creating job card");
      return false;
    }
    
    // Create job card data
    const jobCardData: JobCardFormData = {
      job_id: booking.service_id || "",
      payment_method: "none", // Will be updated when job is completed
      payment_amount: booking.price || booking.service?.price || 0,
      start_time: new Date().toISOString(),
      notes: `Job created from booking: ${booking.title} (ID: ${booking.id})`
    };
    
    // Insert into job_cards table
    const { data, error } = await supabase
      .from('job_cards')
      .insert({
        staff_relation_id: staffRelationId,
        job_id: jobCardData.job_id,
        start_time: jobCardData.start_time,
        payment_method: jobCardData.payment_method,
        payment_amount: jobCardData.payment_amount,
        notes: jobCardData.notes
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating job card from booking:", error);
      return false;
    }
    
    // Update booking status to reflect job has started
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', booking.id);
      
    if (updateError) {
      console.error("Error updating booking status:", updateError);
    }
    
    return true;
  } catch (error) {
    console.error("Error in createJobCardFromBooking:", error);
    return false;
  }
};
