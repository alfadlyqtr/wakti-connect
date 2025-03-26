
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task.types";

// Stub function that logs a message and returns the unmodified task
export async function shareTask(taskId: string, userEmail: string): Promise<Task> {
  console.log("Task sharing feature has been removed");
  
  // Get the original task to return
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();
    
  if (error) throw error;
  
  return data as Task;
}

export async function assignTask(taskId: string, userEmail: string): Promise<Task> {
  console.log("Task assignment feature has been removed");
  
  // Get the original task to return
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();
    
  if (error) throw error;
  
  return data as Task;
}
