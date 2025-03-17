
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { mapToAppointment } from "../utils/mappers";

/**
 * Fetches appointments assigned to the current user
 */
export const fetchAssignedAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  if (userRole === "free") {
    return []; // Free users can't have assigned appointments
  }
  
  try {
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    const userId = session.user.id;
    console.log("Fetching assigned appointments for user ID:", userId);
    
    // Query appointments assigned to the user
    const { data: appointments, error } = await supabase
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
      .eq('assignee_id', userId)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error("Error fetching assigned appointments:", error);
      throw new Error(`Failed to fetch assigned appointments: ${error.message}`);
    }
    
    console.log("Assigned appointments fetched:", appointments?.length || 0);
    
    // Map to properly typed Appointment objects using the mapToAppointment utility
    return (appointments || []).map(appt => mapToAppointment(appt));
  } catch (error) {
    console.error("Error in fetchAssignedAppointments:", error);
    return [];
  }
};
