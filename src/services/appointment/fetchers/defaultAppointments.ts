
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

/**
 * Fetches default appointments list based on user role
 */
export const fetchDefaultAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch default appointments: ${error.message}`);
    }

    // Map the database records to the Appointment type with validated status
    return (appointments || []).map(appt => ({
      ...appt,
      status: validateAppointmentStatus(appt.status)
    }));
  } catch (error) {
    console.error("Error in fetchDefaultAppointments:", error);
    return [];
  }
};
