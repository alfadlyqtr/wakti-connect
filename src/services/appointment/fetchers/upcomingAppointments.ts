
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

/**
 * Fetches upcoming appointments for the current user
 */
export async function fetchUpcomingAppointments(userId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true });
    
  if (error) throw error;
  
  // Transform data ensuring proper type casting for status
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
