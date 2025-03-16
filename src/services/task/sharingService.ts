
import { supabase } from "@/integrations/supabase/client";

// Share a task with another user
export async function shareTask(taskId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('shared_tasks')
    .insert({
      task_id: taskId,
      shared_with: userId
    });

  if (error) throw error;

  return true;
}

// Assign a task to a staff member
export async function assignTask(taskId: string, staffId: string): Promise<boolean> {
  // First, check if assignee_id field exists in the tasks table
  const { data: taskData, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (fetchError) throw fetchError;

  // Now perform the update with the correct field
  const { error } = await supabase
    .from('tasks')
    .update({ 
      assignee_id: staffId 
    })
    .eq('id', taskId);

  if (error) throw error;

  return true;
}
