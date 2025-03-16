
import { supabase } from "@/integrations/supabase/client";
import { 
  Appointment, 
  AppointmentTab, 
  AppointmentFormData, 
  AppointmentsResult 
} from "@/types/appointment.types";

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
  
  let query: any;
  
  switch (tab) {
    case "upcoming":
      // Upcoming appointments
      query = supabase
        .from('appointments')
        .select('*')
        .or(`user_id.eq.${session.user.id},invited_users.cs.{${session.user.id}}`)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });
      break;
      
    case "past":
      // Past appointments
      query = supabase
        .from('appointments')
        .select('*')
        .or(`user_id.eq.${session.user.id},invited_users.cs.{${session.user.id}}`)
        .lt('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: false });
      break;
      
    case "invitations":
      // Appointment invitations
      query = supabase
        .from('appointment_invitations')
        .select('appointment_id, status, appointments(*)')
        .eq('user_id', session.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      break;
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error fetching ${tab}:`, error);
    throw error;
  }
  
  // Transform invitation data if needed
  const transformedData: Appointment[] = tab === "invitations" 
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

  // Basic appointment data
  const newAppointment = {
    user_id: session.user.id,
    title: appointmentData.title,
    description: appointmentData.description || null,
    location: appointmentData.location || null,
    date: appointmentData.date,
    start_time: appointmentData.startTime,
    end_time: appointmentData.endTime,
    is_all_day: appointmentData.isAllDay || false,
    status: "confirmed"
  };

  // Handle invitees separately to avoid TypeScript errors
  const inviteesData = appointmentData.invitees?.length 
    ? { invited_users: appointmentData.invitees } 
    : {};

  // Create the complete appointment data
  const fullAppointmentData = { ...newAppointment, ...inviteesData };

  const { data, error } = await supabase
    .from('appointments')
    .insert(fullAppointmentData)
    .select();

  if (error) {
    throw error;
  }
  
  return data[0] as Appointment;
}
