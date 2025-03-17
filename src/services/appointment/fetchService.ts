
import { supabase } from "@/integrations/supabase/client";
import { AppointmentTab, Appointment, AppointmentsResult } from "./types";
import { fetchers } from "./fetchers";

/**
 * Fetches appointments based on the selected tab
 */
export const fetchAppointments = async (
  tab: AppointmentTab
): Promise<AppointmentsResult> => {
  try {
    let appointments: Appointment[] = [];

    // Get the user's account type (free, individual, business)
    const { data: userRole, error: roleError } = await supabase.rpc(
      "get_auth_user_account_type"
    );

    if (roleError) {
      throw new Error(`Failed to check user role: ${roleError.message}`);
    }

    // Use the appropriate fetcher for the current tab
    switch (tab) {
      case "my-appointments":
        appointments = await fetchers.myAppointments();
        break;
      case "shared-appointments":
        appointments = await fetchers.sharedAppointments();
        break;
      case "assigned-appointments":
        appointments = await fetchers.assignedAppointments();
        break;
      case "team-appointments":
        appointments = await fetchers.defaultAppointments();
        break;
      case "upcoming":
        appointments = await fetchers.upcomingAppointments();
        break;
      case "past":
        appointments = await fetchers.pastAppointments();
        break;
      case "invitations":
        appointments = await fetchers.invitationAppointments();
        break;
      default:
        appointments = await fetchers.defaultAppointments();
    }

    // Return both the appointments and the user's role
    return {
      appointments,
      userRole: userRole || "free",
    };
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};
