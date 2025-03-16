
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentFormData } from "./types";
import { formatDateTimeToISO } from "@/utils/formatUtils";
import { createNewAppointment } from "./baseService";

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
