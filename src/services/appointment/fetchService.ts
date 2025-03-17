
import { supabase } from "@/integrations/supabase/client";
import { AppointmentTab, Appointment, AppointmentsResult } from "./types";
import {
  fetchMyAppointments,
  fetchSharedAppointments,
  fetchAssignedAppointments,
  fetchDefaultAppointments,
  fetchUpcomingAppointments,
  fetchPastAppointments,
  fetchInvitationAppointments
} from "./fetchers";

/**
 * Fetches appointments based on the selected tab
 */
export const fetchAppointments = async (
  tab: AppointmentTab
): Promise<AppointmentsResult> => {
  try {
    let appointments: Appointment[] = [];

    // Get the user's account type (free, individual, business)
    const { data: userRoleData, error: roleError } = await supabase.rpc(
      "get_auth_user_account_type"
    );

    if (roleError) {
      throw new Error(`Failed to check user role: ${roleError.message}`);
    }

    // Make sure userRole is one of the allowed values
    const userRole = (userRoleData as string) === "individual" ? "individual" :
                      (userRoleData as string) === "business" ? "business" : "free";

    // Use the appropriate fetcher for the current tab
    switch (tab) {
      case "my-appointments":
        appointments = await fetchMyAppointments();
        break;
      case "shared-appointments":
        appointments = await fetchSharedAppointments();
        break;
      case "assigned-appointments":
        appointments = await fetchAssignedAppointments();
        break;
      case "team-appointments":
        appointments = await fetchDefaultAppointments();
        break;
      case "upcoming":
        appointments = await fetchUpcomingAppointments();
        break;
      case "past":
        appointments = await fetchPastAppointments();
        break;
      case "invitations":
        appointments = await fetchInvitationAppointments();
        break;
      default:
        appointments = await fetchDefaultAppointments();
    }

    // Return both the appointments and the user's role
    return {
      appointments,
      userRole
    };
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};
