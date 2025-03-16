
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentFormData } from "./types";
import { formatDateTimeToISO } from "@/utils/formatUtils";
import { createNewAppointment } from "./baseService";
import { RecurringFormData, EntityType } from "@/types/recurring.types";
import { createRecurringSetting, generateRecurringDates } from "@/services/recurring/recurringService";

export async function createAppointment(
  appointmentData: AppointmentFormData, 
  recurringData?: RecurringFormData
): Promise<Appointment> {
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
  
  // If recurring data is provided, create recurring settings
  if (recurringData && appointment) {
    try {
      await createRecurringSetting(appointment.id, 'appointment' as EntityType, recurringData);
      
      // If we need to generate recurring instances
      if (processedData.start_time && recurringData.frequency) {
        // This is a more complex feature that would involve creating multiple appointments
        // and setting their is_recurring_instance flag to true
      }
    } catch (error: any) {
      // Log the error but don't fail the appointment creation
      console.error("Failed to create recurring settings:", error);
      
      if (error.message === "This feature is only available for paid accounts") {
        throw error; // Re-throw this specific error to handle in the UI
      }
    }
  }
  
  return appointment;
}

// Create recurring appointment instances
export async function createRecurringAppointmentInstances(
  originalAppointmentId: string,
  dates: Date[]
): Promise<Appointment[]> {
  const { data: originalAppointment, error: appointmentError } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', originalAppointmentId)
    .single();
    
  if (appointmentError) throw appointmentError;
  
  const createdAppointments: Appointment[] = [];
  
  for (const date of dates) {
    // Calculate new start and end times based on the original duration
    const originalStart = new Date(originalAppointment.start_time);
    const originalEnd = new Date(originalAppointment.end_time);
    const duration = originalEnd.getTime() - originalStart.getTime();
    
    const newStart = new Date(date);
    newStart.setHours(originalStart.getHours(), originalStart.getMinutes(), originalStart.getSeconds());
    
    const newEnd = new Date(newStart.getTime() + duration);
    
    const newAppointmentData = {
      title: originalAppointment.title,
      description: originalAppointment.description,
      location: originalAppointment.location,
      start_time: newStart.toISOString(),
      end_time: newEnd.toISOString(),
      is_all_day: originalAppointment.is_all_day,
      status: 'scheduled',
      user_id: originalAppointment.user_id,
      is_recurring_instance: true,
      parent_recurring_id: originalAppointmentId
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(newAppointmentData)
      .select()
      .single();
      
    if (error) {
      console.error("Failed to create recurring appointment instance:", error);
    } else if (data) {
      createdAppointments.push(data as Appointment);
    }
  }
  
  return createdAppointments;
}
