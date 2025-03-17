
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

/**
 * Fetches appointments shared with the current user
 */
export const fetchSharedAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    const userId = session.user.id;
    
    // Query appointments shared with the user through invitation
    const { data: appointments, error } = await supabase
      .from('appointment_invitations')
      .select(`
        *,
        appointment:appointment_id (*)
      `)
      .eq('invited_user_id', userId)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch shared appointments: ${error.message}`);
    }
    
    // Map the nested appointment data
    return (appointments || [])
      .map(invitation => invitation.appointment)
      .filter(Boolean)
      .map(appt => ({
        ...appt,
        status: validateAppointmentStatus(appt.status)
      }));
  } catch (error) {
    console.error("Error in fetchSharedAppointments:", error);
    return [];
  }
};
