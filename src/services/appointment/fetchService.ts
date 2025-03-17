
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
    
    // Attempt to get user profile data
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile for appointment access:", profileError);
        // Don't throw here, fall back to localStorage or default
      }
      
      // Get user role from profile data, localStorage, or default to "free"
      const userRole = profileData?.account_type || 
        localStorage.getItem('userRole') as "free" | "individual" | "business" || 
        "free";
      
      // Explicitly log the user role for debugging
      console.log("Fetching appointments for user role:", userRole);
      
      // Fetch appointments based on the selected tab
      try {
        let appointments = [];
        
        switch (tab) {
          case "upcoming":
            appointments = await fetchUpcomingAppointments(session.user.id);
            break;
          
          case "past":
            appointments = await fetchPastAppointments(session.user.id);
            break;
          
          case "invitations":
            appointments = await fetchInvitationAppointments(session.user.id);
            break;
          
          case "my-appointments":
            appointments = await fetchMyAppointments(session.user.id);
            break;
          
          case "shared-appointments":
            appointments = await fetchSharedAppointments(session.user.id);
            break;
          
          case "assigned-appointments":
            appointments = await fetchAssignedAppointments(session.user.id);
            break;
          
          default:
            appointments = await fetchDefaultAppointments(session.user.id);
            break;
        }
        
        // Return the fetched appointments and the user role
        return {
          appointments: appointments,
          userRole: userRole as "free" | "individual" | "business"
        };
      } catch (error) {
        console.error(`Error fetching ${tab} appointments:`, error);
        // Return empty appointments but preserve the user role
        return {
          appointments: [],
          userRole: userRole as "free" | "individual" | "business"
        };
      }
    } catch (error) {
      console.error("Error in profile fetch within fetchAppointments:", error);
      // Fall back to localStorage or default "free"
      const fallbackRole = localStorage.getItem('userRole') as "free" | "individual" | "business" || "free";
      return {
        appointments: [],
        userRole: fallbackRole
      };
    }
  } catch (error) {
    console.error("Error in fetchAppointments auth check:", error);
    throw error;
  }
}
