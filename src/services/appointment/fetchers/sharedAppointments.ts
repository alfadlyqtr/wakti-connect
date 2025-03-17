
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

/**
 * Fetches appointments shared with the current user
 */
export const fetchSharedAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  if (userRole === "free") {
    return []; // Free users can't access shared appointments
  }
  
  try {
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    const userId = session.user.id;
    
    // Query appointments shared with the user through invitation
    const { data: invitations, error } = await supabase
      .from('appointment_invitations')
      .select(`
        *,
        appointment:appointment_id (
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
        )
      `)
      .eq('invited_user_id', userId)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch shared appointments: ${error.message}`);
    }
    
    // Extract appointments from invitations and validate their status
    return (invitations || [])
      .map(invitation => invitation.appointment)
      .filter(Boolean)
      .map(appt => ({
        ...appt,
        status: validateAppointmentStatus(appt.status),
        // Format user data properly, ensuring we handle potential nulls or errors
        user: appt.user && typeof appt.user === 'object' ? {
          id: String(appt.user.id || ''),
          email: String(appt.user.email || ''),
          display_name: appt.user.display_name || null
        } : null,
        // Format assignee data properly, ensuring we handle potential nulls or errors
        assignee: appt.assignee && typeof appt.assignee === 'object' ? {
          id: String(appt.assignee.id || ''),
          email: String(appt.assignee.email || ''),
          display_name: appt.assignee.display_name || null
        } : null
      })) as Appointment[];
  } catch (error) {
    console.error("Error in fetchSharedAppointments:", error);
    return [];
  }
};
