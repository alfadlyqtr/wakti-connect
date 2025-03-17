
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";
import { mapUserProfile } from "../utils/mappers";

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
      console.error("fetchMyAppointments: No authenticated user found");
      throw new Error("No authenticated user");
    }
    
    const userId = session.user.id;
    
    // Store user ID in localStorage for use in components
    localStorage.setItem('userId', userId);
    
    // Build query based on user role
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
      .order('start_time', { ascending: true });
    
    // For free users, limit the results
    if (userRole === "free") {
      query.limit(5);
    }
    
    const { data: appointments, error } = await query;
    
    if (error) {
      console.error("Error fetching my appointments:", error);
      throw new Error(`Failed to fetch my appointments: ${error.message}`);
    }
    
    if (!appointments || appointments.length === 0) {
      console.log("No appointments found for the current user");
      return [];
    }
    
    // Map the database records to properly typed Appointment objects
    return appointments.map(appt => {
      return {
        ...appt,
        status: validateAppointmentStatus(appt.status),
        // Use mapUserProfile to safely handle user data
        user: mapUserProfile(appt.user),
        // Use mapUserProfile to safely handle assignee data
        assignee: mapUserProfile(appt.assignee)
      } as Appointment;
    });
  } catch (error) {
    console.error("Error in fetchMyAppointments:", error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};
