
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { mapToAppointment } from "../utils/mappers";

/**
 * Fetches appointments with pending invitations
 */
export const fetchInvitationAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    const userId = session.user.id;
    
    // Query appointments with pending invitations
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
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch invitation appointments: ${error.message}`);
    }
    
    // Extract appointments from invitations and map them
    return (invitations || [])
      .map(invitation => invitation.appointment)
      .filter(Boolean)
      .map(appt => mapToAppointment(appt));
  } catch (error) {
    console.error("Error in fetchInvitationAppointments:", error);
    return [];
  }
};
