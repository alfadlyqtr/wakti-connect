
import { supabase } from "@/integrations/supabase/client";
import { AppointmentTab, AppointmentsResult } from "./types";

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
  
  // Declare query result variables outside the switch to avoid deep type instantiation
  let queryResult;
  
  // Use switch case to handle all tab values properly
  switch (tab) {
    case "upcoming": {
      queryResult = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });
      break;
    }
    case "past": {
      queryResult = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .lt('start_time', new Date().toISOString())
        .order('start_time', { ascending: false });
      break;
    }
    case "invitations": {
      queryResult = await supabase
        .from('appointment_invitations')
        .select('appointment_id, appointments(*)')
        .eq('invitee_id', session.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      break;
    }
    case "my-appointments": {
      queryResult = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
      break;
    }
    case "shared-appointments": {
      queryResult = await supabase
        .from('appointment_invitations')
        .select('appointment_id, appointments(*)')
        .eq('invitee_id', session.user.id)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });
      break;
    }
    case "assigned-appointments": {
      queryResult = await supabase
        .from('appointments')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('start_time', { ascending: true });
      break;
    }
    default: {
      queryResult = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
      break;
    }
  }
  
  if (queryResult.error) {
    throw queryResult.error;
  }
  
  let appointments = queryResult.data || [];
  
  // Transform invitations data if needed
  if (tab === "invitations" || tab === "shared-appointments") {
    appointments = appointments.map((item: any) => item.appointments);
  }
  
  return { 
    appointments: appointments,
    userRole: userRole as "free" | "individual" | "business"
  };
}
