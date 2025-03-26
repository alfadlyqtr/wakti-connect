
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";
import { TaskStatus, TaskPriority } from "@/types/task.types";

export async function fetchSharedTasks(userId: string): Promise<TaskWithSharedInfo[]> {
  // Fetch tasks shared with the user
  const { data: sharedTaskIds, error: sharedError } = await supabase
    .from('shared_tasks')
    .select('task_id')
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
    return {
      ...task,
      is_shared: true,
      status: task.status as TaskStatus,
      priority: task.priority as TaskPriority,
      original_owner_id: task.user_id
    };
  });
  
  return tasksWithSharedInfo;
}
