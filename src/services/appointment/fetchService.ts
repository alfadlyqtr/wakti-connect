
import { supabase } from "@/integrations/supabase/client";
import { AppointmentTab, AppointmentsResult } from "./types";
import {
  fetchUpcomingAppointments,
  fetchPastAppointments,
  fetchInvitationAppointments,
  fetchMyAppointments,
  fetchSharedAppointments,
  fetchAssignedAppointments,
  fetchDefaultAppointments
} from "./fetchers";

/**
 * Main function to fetch appointments based on the selected tab
 */
export async function fetchAppointments(tab: AppointmentTab): Promise<AppointmentsResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching profile for appointment access:", profileError);
      throw profileError;
    }
    
    // Explicitly log the user role to debug
    const userRole = profileData?.account_type || "free";
    console.log("User role for appointments:", userRole);
    
    // Return early with empty data if there was a profile error
    if (!profileData) {
      console.warn("No profile data found, returning empty appointments");
      return {
        appointments: [],
        userRole: "free"
      };
    }
    
    // Fetch appointments based on the selected tab
    try {
      switch (tab) {
        case "upcoming":
          return {
            appointments: await fetchUpcomingAppointments(session.user.id),
            userRole: userRole as "free" | "individual" | "business"
          };
        
        case "past":
          return {
            appointments: await fetchPastAppointments(session.user.id),
            userRole: userRole as "free" | "individual" | "business"
          };
        
        case "invitations":
          return {
            appointments: await fetchInvitationAppointments(session.user.id),
            userRole: userRole as "free" | "individual" | "business"
          };
        
        case "my-appointments":
          return {
            appointments: await fetchMyAppointments(session.user.id),
            userRole: userRole as "free" | "individual" | "business"
          };
        
        case "shared-appointments":
          return {
            appointments: await fetchSharedAppointments(session.user.id),
            userRole: userRole as "free" | "individual" | "business"
          };
        
        case "assigned-appointments":
          return {
            appointments: await fetchAssignedAppointments(session.user.id),
            userRole: userRole as "free" | "individual" | "business"
          };
        
        default:
          return {
            appointments: await fetchDefaultAppointments(session.user.id),
            userRole: userRole as "free" | "individual" | "business"
          };
      }
    } catch (error) {
      console.error(`Error fetching ${tab} appointments:`, error);
      // Return empty appointments but preserve the user role
      return {
        appointments: [],
        userRole: userRole as "free" | "individual" | "business"
      };
    }
  } catch (error) {
    console.error("Error in fetchAppointments:", error);
    throw error;
  }
}
