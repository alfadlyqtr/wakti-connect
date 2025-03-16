
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
      
      // Transform data to ensure it has all Appointment properties
      appointmentsData = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        description: item.description,
        location: item.location,
        start_time: item.start_time,
        end_time: item.end_time,
        is_all_day: item.is_all_day || false,
        status: item.status || "scheduled",
        assignee_id: item.assignee_id || null,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
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
      
      // Transform data to ensure it has all Appointment properties
      appointmentsData = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        description: item.description,
        location: item.location,
        start_time: item.start_time,
        end_time: item.end_time,
        is_all_day: item.is_all_day || false,
        status: item.status || "scheduled",
        assignee_id: item.assignee_id || null,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
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
            const appt = item.appointments;
            // Use explicit property assignments with default values as needed
            appointmentsData.push({
              id: appt.id,
              user_id: appt.user_id,
              title: appt.title,
              description: appt.description,
              location: appt.location,
              start_time: appt.start_time,
              end_time: appt.end_time,
              is_all_day: appt.is_all_day || false,
              status: appt.status || "scheduled",
              assignee_id: appt.assignee_id || null,
              created_at: appt.created_at,
              updated_at: appt.updated_at
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
      
      // Transform data to ensure it has all Appointment properties
      appointmentsData = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        description: item.description,
        location: item.location,
        start_time: item.start_time,
        end_time: item.end_time,
        is_all_day: item.is_all_day || false,
        status: item.status || "scheduled",
        assignee_id: item.assignee_id || null,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
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
            const appt = item.appointments;
            // Use explicit property assignments with default values as needed
            appointmentsData.push({
              id: appt.id,
              user_id: appt.user_id,
              title: appt.title,
              description: appt.description,
              location: appt.location,
              start_time: appt.start_time,
              end_time: appt.end_time,
              is_all_day: appt.is_all_day || false,
              status: appt.status || "scheduled",
              assignee_id: appt.assignee_id || null,
              created_at: appt.created_at,
              updated_at: appt.updated_at
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
      
      // Transform data to ensure it has all Appointment properties
      appointmentsData = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        description: item.description,
        location: item.location,
        start_time: item.start_time,
        end_time: item.end_time,
        is_all_day: item.is_all_day || false,
        status: item.status || "scheduled",
        assignee_id: item.assignee_id || null,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      break;
    }
    default: {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      
      // Transform data to ensure it has all Appointment properties
      appointmentsData = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        description: item.description,
        location: item.location,
        start_time: item.start_time,
        end_time: item.end_time,
        is_all_day: item.is_all_day || false,
        status: item.status || "scheduled",
        assignee_id: item.assignee_id || null,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      break;
    }
  }
  
  return { 
    appointments: appointmentsData,
    userRole: userRole as "free" | "individual" | "business"
  };
}
