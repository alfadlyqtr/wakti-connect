
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { mapToAppointment } from "../utils/mappers";

/**
 * Fetches default appointments list based on user role
 * Used as the default data source and for team view
 */
export const fetchDefaultAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    // Query appointments with user and assignee details
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
      .order('start_time', { ascending: true });
    
    // For free users, limit the results
    if (userRole === "free") {
      query.limit(5);
    }
    
    const { data: appointments, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch default appointments: ${error.message}`);
    }
    
    // Map to properly typed Appointment objects using our mapper function
    return (appointments || []).map(appt => mapToAppointment(appt));
  } catch (error) {
    console.error("Error in fetchDefaultAppointments:", error);
    return [];
  }
};
