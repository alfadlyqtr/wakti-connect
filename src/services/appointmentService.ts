
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentTab, AppointmentFormData, AppointmentsResult } from "@/types/appointment.types";

export async function fetchUserRole() {
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
  
  return profileData?.account_type || "free";
}

export async function fetchAppointments(tab: AppointmentTab): Promise<AppointmentsResult> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("No active session");
  }
  
  const userRole = await fetchUserRole();
  
  let appointmentsData;
  
  switch (tab) {
    case "my-appointments":
      // User's own appointments
      const { data: myAppointments, error: myError } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
        
      if (myError) throw myError;
      appointmentsData = myAppointments;
      break;
      
    case "shared-appointments":
      // Appointments shared with the user
      const { data: sharedData, error: sharedError } = await supabase
        .from('appointment_invitations') // Changed from shared_appointments to match correct table
        .select('appointment_id, appointments(*)')
        .eq('invited_user_id', session.user.id) // Using invited_user_id instead of shared_with
        .order('created_at', { ascending: false });
        
      if (sharedError) throw sharedError;
      appointmentsData = sharedData.map((item: any) => item.appointments);
      break;
      
    case "assigned-appointments":
      // Appointments assigned to the user (for staff members)
      const { data: assignedAppointments, error: assignedError } = await supabase
        .from('appointments')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('start_time', { ascending: true });
        
      if (assignedError) throw assignedError;
      appointmentsData = assignedAppointments;
      break;
  }
  
  return { 
    appointments: appointmentsData as Appointment[],
    userRole
  };
}

export async function createAppointment(appointmentData: AppointmentFormData) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required");
  }

  const newAppointment = {
    user_id: session.user.id,
    title: appointmentData.title,
    description: appointmentData.description || "",
    start_time: appointmentData.start_time,
    end_time: appointmentData.end_time,
    location: appointmentData.location || null,
    is_all_day: appointmentData.is_all_day,
    status: appointmentData.status || "upcoming",
    assignee_id: appointmentData.assignee_id || null
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert(newAppointment)
    .select();

  if (error) {
    throw error;
  }
  
  return data[0];
}
