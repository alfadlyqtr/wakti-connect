
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

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
    
    // Map to properly typed Appointment objects
    return (appointments || []).map(appt => ({
      ...appt,
      status: validateAppointmentStatus(appt.status),
      // Format user data properly
      user: appt.user ? {
        id: String(appt.user.id || ''),
        email: String(appt.user.email || ''),
        display_name: appt.user.display_name || null
      } : null,
      // Format assignee data properly
      assignee: appt.assignee ? {
        id: String(appt.assignee.id || ''),
        email: String(appt.assignee.email || ''),
        display_name: appt.assignee.display_name || null
      } : null
    })) as Appointment[];
  } catch (error) {
    console.error("Error in fetchDefaultAppointments:", error);
    return [];
  }
};
