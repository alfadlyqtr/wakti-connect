
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";

export async function fetchSharedTasks(userId: string): Promise<TaskWithSharedInfo[]> {
  // Fetch tasks shared with the user
  const { data: sharedTaskIds, error: sharedError } = await supabase
    .from('shared_tasks')
    .select('task_id, shared_by')
    .eq('shared_with', userId);
    
  if (sharedError) throw sharedError;
  
  if (!sharedTaskIds || sharedTaskIds.length === 0) {
    return [];
  }
  
  const taskIds = sharedTaskIds.map(st => st.task_id);
  
  // Fetch the actual task data
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subtasks:todo_items(*)')
    .in('id', taskIds)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Add shared_by information to each task
  const tasksWithSharedInfo = (data || []).map(task => {
    const sharedInfo = sharedTaskIds.find(st => st.task_id === task.id);
    return {
      ...task,
      is_shared: true,
      shared_by: sharedInfo?.shared_by,
      original_owner_id: task.user_id
    };
  });
  
  return tasksWithSharedInfo;
}
