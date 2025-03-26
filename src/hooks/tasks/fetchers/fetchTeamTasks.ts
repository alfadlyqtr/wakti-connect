
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";

export async function fetchTeamTasks(businessId: string): Promise<TaskWithSharedInfo[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subtasks:todo_items(*)')
    .eq('user_id', businessId)
    .eq('is_team_task', true)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data || [];
}
