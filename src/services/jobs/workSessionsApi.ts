
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch active work session for a staff member
 */
export const fetchActiveWorkSession = async (staffRelationId: string) => {
  const { data, error } = await supabase
    .from('staff_work_logs')
    .select('*')
    .eq('staff_relation_id', staffRelationId)
    .eq('status', 'active')
    .maybeSingle();
  
  if (error) throw new Error(`Error fetching active work session: ${error.message}`);
  return data;
};

/**
 * Start a new work session
 */
export const startWorkSession = async (staffRelationId: string) => {
  const { data, error } = await supabase
    .from('staff_work_logs')
    .insert({
      staff_relation_id: staffRelationId,
      start_time: new Date().toISOString(),
      status: 'active'
    })
    .select()
    .single();
    
  if (error) throw new Error(`Error starting work session: ${error.message}`);
  return data;
};

/**
 * End an active work session
 */
export const endWorkSession = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('staff_work_logs')
    .update({
      end_time: new Date().toISOString(),
      status: 'completed'
    })
    .eq('id', sessionId)
    .select()
    .single();
    
  if (error) throw new Error(`Error ending work session: ${error.message}`);
  return data;
};

/**
 * Fetch staff work history
 */
export const fetchWorkHistory = async (staffRelationId: string) => {
  const { data, error } = await supabase
    .from('staff_work_logs')
    .select('*')
    .eq('staff_relation_id', staffRelationId)
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(`Error fetching work history: ${error.message}`);
  return data;
};
