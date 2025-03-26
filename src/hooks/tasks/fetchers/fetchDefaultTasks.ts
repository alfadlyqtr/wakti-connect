
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";
import { TaskStatus, TaskPriority } from "@/types/task.types";

export async function fetchDefaultTasks(userId: string): Promise<TaskWithSharedInfo[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subtasks:todo_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Convert string status and priority to their proper types
  const typedTasks = (data || []).map(task => ({
    ...task,
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority
  }));
  
  return typedTasks;
}
