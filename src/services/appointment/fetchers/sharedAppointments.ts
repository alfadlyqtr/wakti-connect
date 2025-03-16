
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

/**
 * Fetches appointments shared with the current user
 */
export async function fetchSharedAppointments(userId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointment_invitations')
    .select('appointment_id, appointments(*)')
    .eq('invited_user_id', userId)
    .eq('status', 'accepted')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Extract appointments with proper typing
  const appointmentsData: Appointment[] = [];
  if (data && data.length > 0) {
    for (const item of data) {
      if (item.appointments) {
        const appt = item.appointments;
        appointmentsData.push({
          id: appt.id,
          user_id: appt.user_id,
          title: appt.title,
          description: appt.description,
          location: appt.location,
          start_time: appt.start_time,
          end_time: appt.end_time,
          is_all_day: appt.is_all_day || false,
          status: validateAppointmentStatus(appt.status),
          assignee_id: appt.assignee_id || null,
          created_at: appt.created_at,
          updated_at: appt.updated_at
        });
      }
    }
  }
  return appointmentsData;
}
