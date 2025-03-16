
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentFormData } from "./types";

// Helper to create appointment
export const createNewAppointment = async (
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
    status: formData.status || "scheduled",
    assignee_id: formData.assignee_id || null
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select();

  if (error) throw error;
  
  return data[0] as Appointment;
};
