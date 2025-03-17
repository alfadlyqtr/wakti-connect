
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

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
    
    // Store user ID in localStorage for use in components
    localStorage.setItem('userId', userId);
    
    console.log("Fetching my appointments for user ID:", userId);
    
    // Query appointments created by the user
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error("Error fetching my appointments:", error);
      throw new Error(`Failed to fetch my appointments: ${error.message}`);
    }
    
    console.log("My appointments fetched:", appointments?.length || 0);
    
    // Map the database records to the Appointment type with validated status
    return (appointments || []).map(appt => ({
      ...appt,
      status: validateAppointmentStatus(appt.status)
    }));
  } catch (error) {
    console.error("Error in fetchMyAppointments:", error);
    return [];
  }
};
