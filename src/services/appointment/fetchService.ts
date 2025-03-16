
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
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("No active session");
  }
  
  const { data: profileData } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', session.user.id)
    .single();
  
  const userRole = profileData?.account_type || "free";
  
  // Fetch appointments based on the selected tab
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
}
