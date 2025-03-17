
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

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
    console.error("Error in fetchAssignedAppointments:", error);
    return [];
  }
};
