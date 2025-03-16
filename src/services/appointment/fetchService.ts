
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
  
  // Declare variable for query result
  let data: any[] = [];
  let error: any = null;
  
  // Use switch case to handle all tab values properly and avoid deep type instantiation
  switch (tab) {
    case "upcoming": {
      const result = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });
      data = result.data || [];
      error = result.error;
      break;
    }
    case "past": {
      const result = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .lt('start_time', new Date().toISOString())
        .order('start_time', { ascending: false });
      data = result.data || [];
      error = result.error;
      break;
    }
    case "invitations": {
      const result = await supabase
        .from('appointment_invitations')
        .select('appointment_id, appointments(*)')
        .eq('invitee_id', session.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      data = result.data || [];
      error = result.error;
      break;
    }
    case "my-appointments": {
      const result = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
      data = result.data || [];
      error = result.error;
      break;
    }
    case "shared-appointments": {
      const result = await supabase
        .from('appointment_invitations')
        .select('appointment_id, appointments(*)')
        .eq('invitee_id', session.user.id)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });
      data = result.data || [];
      error = result.error;
      break;
    }
    case "assigned-appointments": {
      const result = await supabase
        .from('appointments')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('start_time', { ascending: true });
      data = result.data || [];
      error = result.error;
      break;
    }
    default: {
      const result = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
      data = result.data || [];
      error = result.error;
      break;
    }
  }
  
  if (error) {
    throw error;
  }
  
  // Transform invitations data if needed
  let transformedData;
  
  if (tab === "invitations" || tab === "shared-appointments") {
    transformedData = data.map((item: any) => item.appointments);
  } else {
    transformedData = data;
  }
  
  return { 
    appointments: transformedData,
    userRole: userRole as "free" | "individual" | "business"
  };
}
