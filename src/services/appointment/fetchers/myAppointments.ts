
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

/**
 * Fetches all appointments created by the current user
 */
export async function fetchMyAppointments(userId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: true });
    
  if (error) throw error;
  
  // Transform data with proper typing
  return (data || []).map(item => ({
    id: item.id,
    user_id: item.user_id,
    title: item.title,
    description: item.description,
    location: item.location,
    start_time: item.start_time,
    end_time: item.end_time,
    is_all_day: item.is_all_day || false,
    status: validateAppointmentStatus(item.status),
    assignee_id: item.assignee_id || null,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
}
