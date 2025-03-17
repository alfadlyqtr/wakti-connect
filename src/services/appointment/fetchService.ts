
import { supabase } from "@/integrations/supabase/client";
import { AppointmentTab, Appointment, AppointmentsResult, MonthlyUsage } from "./types";
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
 * Fetches the current user's monthly usage data (relevant for free accounts)
 */
const fetchMonthlyUsage = async (): Promise<MonthlyUsage | null> => {
  const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed
  const currentYear = new Date().getFullYear();
  
  try {
    const { data: usageData, error } = await supabase
      .from('user_monthly_usage')
      .select('*')
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching monthly usage:", error);
      return null;
    }
    
    return usageData;
  } catch (error) {
    console.error("Error in fetchMonthlyUsage:", error);
    return null;
  }
};

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
    
    // Store user role in localStorage for access in components
    localStorage.setItem('userRole', userRole);

    // Get monthly usage if user is on a free plan
    let monthlyUsage: MonthlyUsage | null = null;
    if (userRole === 'free') {
      monthlyUsage = await fetchMonthlyUsage();
      console.log("Monthly usage data:", monthlyUsage);
    }

    // Use the appropriate fetcher for the current tab
    try {
      console.log(`Using fetcher for tab "${tab}" with userRole "${userRole}"`);
      
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
      if (appointments.length > 0) {
        console.log("First appointment sample:", {
          id: appointments[0].id,
          title: appointments[0].title,
          user_id: appointments[0].user_id,
          start_time: appointments[0].start_time
        });
      }
    } catch (fetchError: any) {
      console.error(`Error fetching appointments for tab "${tab}":`, fetchError);
      // Return empty array but don't throw, so UI can still render
      appointments = [];
    }

    // Return the appointments, user role, and monthly usage information
    return {
      appointments,
      userRole,
      monthlyUsage: monthlyUsage || undefined
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
