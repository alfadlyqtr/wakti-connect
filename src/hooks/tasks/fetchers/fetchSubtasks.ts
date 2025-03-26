
import { supabase } from "@/integrations/supabase/client";
import { SubTask } from "@/types/task.types";
import { TaskWithSharedInfo } from "../types";

export async function fetchSubtasks(taskId: string): Promise<SubTask[]> {
  const { data, error } = await supabase
    .from('todo_items')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  
  return data || [];
}
