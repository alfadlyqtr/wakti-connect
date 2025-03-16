
import { supabase } from "@/integrations/supabase/client";

/**
 * Share a task with another user
 */
export async function shareTask(taskId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('shared_tasks')
    .insert({
      task_id: taskId,
      shared_with: userId
    });
  
  if (error) throw error;
}

/**
 * Assign a task to a staff member (for business accounts)
 */
export async function assignTask(taskId: string, staffId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ assignee_id: staffId })
    .eq('id', taskId);
  
  if (error) throw error;
}
