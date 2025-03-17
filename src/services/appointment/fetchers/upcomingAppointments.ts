
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

/**
 * Fetches upcoming appointments for the current user
 * (appointments with start time in the future)
 */
export const fetchUpcomingAppointments = async (
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
    
    // Query user's upcoming appointments
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
      .gte('start_time', now)
      .order('start_time', { ascending: true });
    
    // For free users, limit the results
    if (userRole === "free") {
      query.limit(3);
    }
    
    const { data: appointments, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch upcoming appointments: ${error.message}`);
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
    console.error("Error in fetchUpcomingAppointments:", error);
    return [];
  }
};
