
import { AppointmentsResult, AppointmentTab } from './types';
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";
import * as fetchers from './fetchers';

/**
 * Main function to fetch appointments based on the tab selection
 */
export async function fetchAppointments(tab: AppointmentTab): Promise<AppointmentsResult> {
  console.log("Fetching appointments for tab:", tab);
  
  try {
    // First, get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session. Please log in to view appointments.");
    }
    
    // Get user account type for permission checks
    console.log("Checking user account type...");
    const { data: accountType, error: accountTypeError } = await supabase
      .rpc('get_auth_user_account_type', { user_uid: session.user.id });
    
    if (accountTypeError) {
      console.error("Error fetching account type:", accountTypeError);
      throw new Error(`Unable to verify account permissions: ${accountTypeError.message}`);
    }
    
    console.log("Fetching appointments for user role:", accountType);
    
    // Use the appropriate fetcher based on the tab
    let appointments = [];
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      try {
        if (tab === 'my-appointments') {
          appointments = await fetchers.fetchMyAppointments();
        } else if (tab === 'shared-appointments') {
          appointments = await fetchers.fetchSharedAppointments();
        } else if (tab === 'upcoming') {
          appointments = await fetchers.fetchUpcomingAppointments();
        } else if (tab === 'past') {
          appointments = await fetchers.fetchPastAppointments();
        } else if (tab === 'invitations') {
          appointments = await fetchers.fetchInvitationAppointments();
        } else if (tab === 'assigned-appointments' || tab === 'team-appointments') {
          appointments = await fetchers.fetchAssignedAppointments();
        } else {
          appointments = await fetchers.fetchDefaultAppointments();
        }
        break;
      } catch (error: any) {
        console.error(`Attempt ${retries + 1} - Error fetching ${tab} appointments:`, error);
        retries++;
        
        if (retries >= maxRetries) {
          console.error(`Failed to fetch ${tab} appointments after ${maxRetries} attempts`);
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      }
    }
    
    // Return appointments with the user's account type
    return {
      appointments,
      userRole: accountType as "free" | "individual" | "business"
    };
  } catch (error: any) {
    console.error("Error in fetchAppointments:", error);
    throw error;
  }
}
