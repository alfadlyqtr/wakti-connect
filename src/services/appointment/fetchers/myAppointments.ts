
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
    console.log("fetchMyAppointments: Starting fetch for role:", userRole);
    
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.error("fetchMyAppointments: No authenticated user found");
      throw new Error("No authenticated user");
    }
    
    const userId = session.user.id;
    
    // Store user ID in localStorage for use in components
    localStorage.setItem('userId', userId);
    
    console.log("Fetching my appointments for user ID:", userId);
    
    // Use a simpler direct query to avoid RLS issues
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error("Error fetching my appointments:", error);
      throw new Error(`Failed to fetch my appointments: ${error.message}`);
    }
    
    // Log the raw data received for debugging
    console.log("Raw appointments data:", JSON.stringify(appointments || []));
    console.log("My appointments fetched:", appointments?.length || 0, "appointments");
    
    if (appointments && appointments.length > 0) {
      console.log("First appointment sample:", {
        id: appointments[0].id,
        title: appointments[0].title,
        user_id: appointments[0].user_id,
        start_time: appointments[0].start_time,
        status: appointments[0].status
      });
    } else {
      console.log("No appointments found for the current user");
    }
    
    // Map the database records to the Appointment type with validated status
    return (appointments || []).map(appt => ({
      ...appt,
      status: validateAppointmentStatus(appt.status)
    }));
  } catch (error) {
    console.error("Error in fetchMyAppointments:", error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};
