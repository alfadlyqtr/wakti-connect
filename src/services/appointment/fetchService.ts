
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
  let appointmentsData: Appointment[] = [];
  
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
      
      // Extract just the appointments objects from the response
      appointmentsData = [];
      if (data && data.length > 0) {
        for (const item of data) {
          if (item.appointments) {
            // Use explicit property assignments with default values as needed
            appointmentsData.push({
              id: item.appointments.id,
              user_id: item.appointments.user_id,
              title: item.appointments.title,
              description: item.appointments.description,
              location: item.appointments.location,
              start_time: item.appointments.start_time,
              end_time: item.appointments.end_time,
              is_all_day: item.appointments.is_all_day || false,
              status: item.appointments.status || "scheduled",
              assignee_id: item.appointments.assignee_id || null,
              created_at: item.appointments.created_at,
              updated_at: item.appointments.updated_at
            });
          }
        }
      }
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
      
      // Extract just the appointments objects from the response
      appointmentsData = [];
      if (data && data.length > 0) {
        for (const item of data) {
          if (item.appointments) {
            // Use explicit property assignments with default values as needed
            appointmentsData.push({
              id: item.appointments.id,
              user_id: item.appointments.user_id,
              title: item.appointments.title,
              description: item.appointments.description,
              location: item.appointments.location,
              start_time: item.appointments.start_time,
              end_time: item.appointments.end_time,
              is_all_day: item.appointments.is_all_day || false,
              status: item.appointments.status || "scheduled",
              assignee_id: item.appointments.assignee_id || null,
              created_at: item.appointments.created_at,
              updated_at: item.appointments.updated_at
            });
          }
        }
      }
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
  
  // Process and normalize the appointments with default values for missing fields
  const normalizedAppointments: Appointment[] = [];
  
  for (const appointment of appointmentsData) {
    normalizedAppointments.push({
      id: appointment.id,
      user_id: appointment.user_id,
      title: appointment.title,
      description: appointment.description,
      location: appointment.location,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      is_all_day: appointment.is_all_day || false,
      status: appointment.status || "scheduled",
      assignee_id: appointment.assignee_id || null,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at
    });
  }
  
  return { 
    appointments: normalizedAppointments,
    userRole: userRole as "free" | "individual" | "business"
  };
}
