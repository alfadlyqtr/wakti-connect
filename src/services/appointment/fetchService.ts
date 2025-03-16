
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
  
  // Declare variable to hold appointments data
  let appointmentsData: any[] = [];
  
  // Use switch case to handle all tab values properly
  switch (tab) {
    case "upcoming": {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      appointmentsData = data || [];
      break;
    }
    case "past": {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .lt('start_time', new Date().toISOString())
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      appointmentsData = data || [];
      break;
    }
    case "invitations": {
      const { data, error } = await supabase
        .from('appointment_invitations')
        .select('appointment_id, appointments(*)')
        .eq('invited_user_id', session.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      appointmentsData = data?.map(item => item.appointments) || [];
      break;
    }
    case "my-appointments": {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      appointmentsData = data || [];
      break;
    }
    case "shared-appointments": {
      const { data, error } = await supabase
        .from('appointment_invitations')
        .select('appointment_id, appointments(*)')
        .eq('invited_user_id', session.user.id)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      appointmentsData = data?.map(item => item.appointments) || [];
      break;
    }
    case "assigned-appointments": {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      appointmentsData = data || [];
      break;
    }
    default: {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      appointmentsData = data || [];
      break;
    }
  }
  
  // Ensure all appointment objects have default values for missing fields
  const appointments = appointmentsData.map(appointment => ({
    ...appointment,
    status: appointment.status || "scheduled",
    assignee_id: appointment.assignee_id || null
  })) as Appointment[];
  
  return { 
    appointments,
    userRole: userRole as "free" | "individual" | "business"
  };
}
