
import { supabase } from "@/integrations/supabase/client";
import { createNotification } from "@/services/notifications";

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
  
  // Send notification to the user
  try {
    await createNotification(
      userId,
      "New Task Shared",
      "A task has been shared with you",
      "task_shared",
      taskId,
      "task"
    );
  } catch (notifyError) {
    console.error("Failed to send notification:", notifyError);
    // Don't throw here - the task was shared successfully
  }
}

/**
 * Assign a task to a staff member (for business accounts)
 * This functionality is currently disabled
 */
export async function assignTask(taskId: string, staffId: string): Promise<void> {
  // This function is intentionally disabled
  console.log("Task assignment functionality is disabled");
  throw new Error("Task assignment functionality is not available at this time");
}
