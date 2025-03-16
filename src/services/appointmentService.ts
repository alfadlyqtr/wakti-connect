
import { supabase } from "@/integrations/supabase/client";
import { 
  Appointment, 
  AppointmentTab, 
  AppointmentFormData, 
  AppointmentsResult,
  AppointmentStatus 
} from "@/types/appointment.types";
import { formatDateTimeToISO } from "@/utils/formatUtils";

// Helper to create appointment
const createNewAppointment = async (
  userId: string, 
  formData: AppointmentFormData
): Promise<Appointment> => {
  // Create the appointment record
  const appointmentData = {
    user_id: userId,
    title: formData.title,
    description: formData.description || null,
    location: formData.location || null,
    start_time: formData.start_time,
    end_time: formData.end_time,
    is_all_day: formData.is_all_day || false,
    status: (formData.status as AppointmentStatus) || "scheduled"
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select();

  if (error) throw error;
  
  return data[0] as Appointment;
};

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
  let query;
  
  // Use switch case to handle all tab values properly
  switch (tab) {
    case "upcoming":
      // Upcoming appointments
      query = supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });
      break;
    case "past":
      // Past appointments
      query = supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .lt('start_time', new Date().toISOString())
        .order('start_time', { ascending: false });
      break;
    case "invitations":
      // Appointment invitations
      query = supabase
        .from('appointment_invitations')
        .select('appointment_id, appointments(*)')
        .eq('invitee_id', session.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      break;
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
        .eq('invitee_id', session.user.id)
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
    default:
      // Default to user's own appointments
      query = supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  // Transform invitations data if needed
  let transformedData: Appointment[];
  
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

export async function createAppointment(appointmentData: AppointmentFormData): Promise<Appointment> {
  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required to create appointments");
  }

  // Process date and time fields if they exist in form data format
  let processedData = { ...appointmentData };
  
  // If we have date and time in form format (not ISO strings), convert them
  if (appointmentData.date && appointmentData.startTime && appointmentData.endTime) {
    const { start_time, end_time } = formatDateTimeToISO(
      appointmentData.date, 
      appointmentData.startTime, 
      appointmentData.endTime
    );
    
    processedData.start_time = start_time;
    processedData.end_time = end_time;
  }

  // Create the appointment
  const appointment = await createNewAppointment(session.user.id, processedData);
  
  // If there are invitees, add them to the appointment_invitations table
  if (appointmentData.invitees && appointmentData.invitees.length > 0) {
    const invitations = appointmentData.invitees.map(inviteeId => ({
      appointment_id: appointment.id,
      invitee_id: inviteeId,
      status: 'pending'
    }));
    
    const { error: inviteError } = await supabase
      .from('appointment_invitations')
      .insert(invitations);
    
    if (inviteError) throw inviteError;
  }
  
  return appointment;
}

export async function respondToInvitation(
  appointmentId: string, 
  response: 'accepted' | 'declined'
): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required");
  }
  
  const { error } = await supabase
    .from('appointment_invitations')
    .update({ status: response })
    .eq('appointment_id', appointmentId)
    .eq('invitee_id', session.user.id);
  
  if (error) throw error;
  
  return true;
}
