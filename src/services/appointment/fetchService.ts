
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
    console.log("Fetching appointments for tab:", tab);
    let appointments: Appointment[] = [];

    // Get the user's account type (free, individual, business)
    const { data: userRoleData, error: roleError } = await supabase.rpc(
      "get_auth_user_account_type"
    );

    if (roleError) {
      console.error("Error checking user role:", roleError);
      throw new Error(`Failed to check user role: ${roleError.message}`);
    }

    console.log("User role retrieved:", userRoleData);

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
    try {
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
      
      console.log(`Fetched ${appointments.length} appointments for tab "${tab}"`);
    } catch (fetchError: any) {
      console.error(`Error fetching appointments for tab "${tab}":`, fetchError);
      // Return empty array but don't throw, so UI can still render
      appointments = [];
    }

    // Return both the appointments and the user's role
    return {
      appointments,
      userRole
    };
  } catch (error: any) {
    console.error("Error in fetchAppointments:", error);
    // Return empty result with default role rather than throwing
    return {
      appointments: [],
      userRole: "free"
    };
  }
};
