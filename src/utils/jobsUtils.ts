
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
 * Check if a job is currently in use (in an active job card)
 * This prevents editing/deleting jobs that are in use
 */
export const isJobInUse = async (jobId: string): Promise<boolean> => {
  try {
    // Check if the job is used in any incomplete job cards (where end_time is null)
    const { data, error, count } = await supabase
      .from('job_cards')
      .select('id', { count: 'exact' })
      .eq('job_id', jobId)
      .is('end_time', null);
      
    if (error) {
      console.error("Error checking if job is in use:", error);
      return true; // Assume it's in use if there's an error (safer)
    }
    
    return (count !== null && count > 0);
  } catch (error) {
    console.error("Error in isJobInUse:", error);
    return true; // Assume it's in use if there's an error (safer)
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
