
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
    
    // Get user account type using the security definer function
    let userRole: "free" | "individual" | "business" = "free";
    
    try {
      const { data: accountType, error: accountTypeError } = await supabase
        .rpc('get_user_account_type', { user_uid: session.user.id });
      
      if (accountTypeError) {
        console.error("Error fetching account type:", accountTypeError);
        // Fall back to localStorage
        userRole = localStorage.getItem('userRole') as "free" | "individual" | "business" || "free";
      } else {
        // Set user role based on account type
        userRole = accountType as "free" | "individual" | "business";
        
        // Cache the user role in localStorage for fallback
        localStorage.setItem('userRole', userRole);
      }
      
      // Explicitly log the user role for debugging
      console.log("Fetching appointments for user role:", userRole);
    } catch (error) {
      console.error("Error in account type retrieval:", error);
      // Fall back to localStorage or default "free"
      userRole = localStorage.getItem('userRole') as "free" | "individual" | "business" || "free";
    }
    
    // If free account, just return empty appointments
    if (userRole === "free") {
      return {
        appointments: [],
        userRole: userRole
      };
    }
    
    // For paid accounts, fetch appointments with retry logic
    try {
      let appointments = [];
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
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
          
          // If we got here without error, exit the retry loop
          break;
        } catch (fetchError: any) {
          console.error(`Attempt ${retries + 1} - Error fetching ${tab} appointments:`, fetchError);
          retries++;
          
          if (retries >= maxRetries) {
            console.error(`Failed to fetch ${tab} appointments after ${maxRetries} attempts`);
            break;
          }
          
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        }
      }
      
      // Return the fetched appointments and the user role
      return {
        appointments: appointments,
        userRole: userRole
      };
    } catch (error) {
      console.error(`Error fetching ${tab} appointments:`, error);
      // Return empty appointments but preserve the user role
      return {
        appointments: [],
        userRole: userRole
      };
    }
  } catch (error) {
    console.error("Error in fetchAppointments auth check:", error);
    throw error;
  }
}
