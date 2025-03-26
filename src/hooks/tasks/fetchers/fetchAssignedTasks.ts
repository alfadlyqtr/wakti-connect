
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";
import { TaskStatus, TaskPriority } from "@/types/task.types";

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
  
  // Convert string status and priority to their proper types
  const typedTasks = (data || []).map(task => ({
    ...task,
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority
  }));
  
  return typedTasks;
}
