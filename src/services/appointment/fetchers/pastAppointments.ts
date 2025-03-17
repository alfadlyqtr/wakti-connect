
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { mapToAppointment } from "../utils/mappers";

/**
 * Fetches past appointments for the current user
 * (appointments with end time in the past)
 */
export const fetchPastAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    const userId = session.user.id;
    const now = new Date().toISOString();
    
    // Query user's past appointments
    const query = supabase
      .from('appointments')
      .select(`
        *,
        user:user_id (
          id,
          email,
          display_name
        ),
        assignee:assignee_id (
          id,
          email,
          display_name
        )
      `)
      .eq('user_id', userId)
      .lt('end_time', now)
      .order('start_time', { ascending: false });
    
    // For free users, limit the results
    if (userRole === "free") {
      query.limit(3);
    }
    
    const { data: appointments, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch past appointments: ${error.message}`);
    }
    
    // Map to properly typed Appointment objects using our mapper function
    return (appointments || []).map(appt => mapToAppointment(appt));
  } catch (error) {
    console.error("Error in fetchPastAppointments:", error);
    return [];
  }
};
