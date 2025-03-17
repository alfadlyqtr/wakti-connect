
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { mapToAppointment } from "../utils/mappers";

/**
 * Fetches appointments created by the current user
 */
export const fetchMyAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    const userId = session.user.id;
    
    // Store user ID in localStorage for use in the UI
    localStorage.setItem('userId', userId);
    
    // Query appointments created by the user
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
      .eq('user_id', userId)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error("Error fetching my appointments:", error);
      throw new Error(`Failed to fetch my appointments: ${error.message}`);
    }
    
    console.log("My appointments fetched:", appointments?.length || 0);
    
    // Use the mapToAppointment utility to safely handle user and assignee data
    return (appointments || []).map(appt => mapToAppointment(appt));
  } catch (error) {
    console.error("Error in fetchMyAppointments:", error);
    return [];
  }
};
