
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
    let userRole: "free" | "individual" | "business";
    if (userRoleData === "individual") {
      userRole = "individual";
    } else if (userRoleData === "business") {
      userRole = "business";
    } else {
      userRole = "free";
    }

    // Use the appropriate fetcher for the current tab
    switch (tab) {
      case "my-appointments":
        appointments = await fetchMyAppointments(userRole);
        break;
      case "shared-appointments":
        appointments = await fetchSharedAppointments(userRole);
        break;
      case "assigned-appointments":
        appointments = await fetchAssignedAppointments(userRole);
        break;
      case "team-appointments":
        appointments = await fetchDefaultAppointments(userRole);
        break;
      case "upcoming":
        appointments = await fetchUpcomingAppointments(userRole);
        break;
      case "past":
        appointments = await fetchPastAppointments(userRole);
        break;
      case "invitations":
        appointments = await fetchInvitationAppointments(userRole);
        break;
      default:
        appointments = await fetchDefaultAppointments(userRole);
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
