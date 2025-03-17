
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

/**
 * Fetches past appointments for the current user
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
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .lt('end_time', now)
      .order('start_time', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch past appointments: ${error.message}`);
    }
    
    // Map the database records to the Appointment type with validated status
    return (appointments || []).map(appt => ({
      ...appt,
      status: validateAppointmentStatus(appt.status)
    }));
  } catch (error) {
    console.error("Error in fetchPastAppointments:", error);
    return [];
  }
};
