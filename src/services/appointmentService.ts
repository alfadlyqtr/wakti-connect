
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentTab, AppointmentFormData, AppointmentsResult } from "@/types/appointment.types";

// Fetch appointments based on the selected tab
export async function fetchAppointments(tab: AppointmentTab): Promise<AppointmentsResult> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("No active session");
  }
  
  // Get user profile to check account type
  const { data: profileData } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', session.user.id)
    .single();
  
  const userRole = profileData?.account_type || "free";
  
  let query;
  
  switch (tab) {
    case "my-appointments":
      // User's own appointments
      query = supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
      break;
      
    case "shared-appointments":
      // Appointments shared with the user
      query = supabase
        .from('appointment_invitations')
        .select('appointment_id, appointments(*)')
        .eq('invited_user_id', session.user.id)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });
      break;
      
    case "assigned-appointments":
      // Appointments assigned to the user (for staff members)
      query = supabase
        .from('appointments')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('start_time', { ascending: true });
      break;
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error fetching ${tab}:`, error);
    throw error;
  }
  
  // Transform shared appointments data if needed
  const transformedData: Appointment[] = tab === "shared-appointments" 
    ? data.map((item: any) => item.appointments) 
    : data;
  
  return { 
    appointments: transformedData,
    userRole: userRole as "free" | "individual" | "business"
  };
}

// Create a new appointment
export async function createAppointment(appointmentData: AppointmentFormData): Promise<Appointment> {
  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required to create appointments");
  }

  const newAppointment = {
    user_id: session.user.id,
    title: appointmentData.title,
    description: appointmentData.description || null,
    start_time: appointmentData.start_time,
    end_time: appointmentData.end_time,
    location: appointmentData.location || null,
    is_all_day: appointmentData.is_all_day || false,
    status: appointmentData.status || "upcoming"
  };

  // If assignee_id is provided and valid, add it to the appointment
  if (appointmentData.assignee_id) {
    Object.assign(newAppointment, { assignee_id: appointmentData.assignee_id });
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert(newAppointment)
    .select();

  if (error) {
    throw error;
  }
  
  return data[0] as Appointment;
}
