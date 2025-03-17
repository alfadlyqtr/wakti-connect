
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";
import { mapUserProfile } from "../utils/mappers";

/**
 * Fetches appointments for which the current user has pending invitations
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
    
    // Query appointments with pending invitations for the user
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
    
    // Map the nested appointment data
    return (invitations || [])
      .map(invitation => {
        if (invitation.appointment) {
          // Add the invitation to the appointment object
          return {
            ...invitation.appointment,
            status: validateAppointmentStatus(invitation.appointment.status),
            // Use mapUserProfile to safely handle user data
            user: mapUserProfile(invitation.appointment.user),
            // Use mapUserProfile to safely handle assignee data
            assignee: mapUserProfile(invitation.appointment.assignee),
            invitations: [invitation]
          };
        }
        return null;
      })
      .filter(Boolean) as Appointment[];
  } catch (error) {
    console.error("Error in fetchInvitationAppointments:", error);
    return [];
  }
};
