
import { supabase } from "@/integrations/supabase/client";
import { AppointmentTab, AppointmentsResult, Appointment } from "./types";

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
  
  // Declare variable to hold query results
  let { data: appointmentsData = [], error } = { data: [] as any[], error: null };
  
  // Use switch case to handle all tab values properly
  switch (tab) {
    case "upcoming": {
      const response = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });
        
      if (response.error) throw response.error;
      appointmentsData = response.data || [];
      break;
    }
    case "past": {
      const response = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .lt('start_time', new Date().toISOString())
        .order('start_time', { ascending: false });
        
      if (response.error) throw response.error;
      appointmentsData = response.data || [];
      break;
    }
    case "invitations": {
      const response = await supabase
        .from('appointment_invitations')
        .select('appointment_id, appointments(*)')
        .eq('invited_user_id', session.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (response.error) throw response.error;
      appointmentsData = response.data?.map(item => item.appointments as Appointment) || [];
      break;
    }
    case "my-appointments": {
      const response = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
        
      if (response.error) throw response.error;
      appointmentsData = response.data || [];
      break;
    }
    case "shared-appointments": {
      const response = await supabase
        .from('appointment_invitations')
        .select('appointment_id, appointments(*)')
        .eq('invited_user_id', session.user.id)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });
        
      if (response.error) throw response.error;
      appointmentsData = response.data?.map(item => item.appointments as Appointment) || [];
      break;
    }
    case "assigned-appointments": {
      const response = await supabase
        .from('appointments')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('start_time', { ascending: true });
        
      if (response.error) throw response.error;
      appointmentsData = response.data || [];
      break;
    }
    default: {
      const response = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
        
      if (response.error) throw response.error;
      appointmentsData = response.data || [];
      break;
    }
  }
  
  // Ensure all appointment objects have default values for missing fields
  const appointments = appointmentsData.map(appointment => ({
    ...appointment,
    status: appointment.status || "scheduled" as const,
    assignee_id: appointment.assignee_id || null
  }));
  
  return { 
    appointments,
    userRole: userRole as "free" | "individual" | "business"
  };
}
