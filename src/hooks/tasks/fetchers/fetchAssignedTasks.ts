
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";

export async function fetchAssignedTasks(
  userId: string, 
  includeTeamTasks = false
): Promise<TaskWithSharedInfo[]> {
  let query = supabase
    .from('tasks')
    .select('*, subtasks:todo_items(*)')
    .eq('assignee_id', userId);
    
  if (!includeTeamTasks) {
    query = query.eq('is_team_task', false);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data || [];
}
