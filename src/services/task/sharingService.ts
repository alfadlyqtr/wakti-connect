
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
 */
export async function assignTask(taskId: string, staffId: string): Promise<void> {
  // Get current user session for notification info
  const { data: sessionData } = await supabase.auth.getSession();
  const assignedBy = sessionData?.session?.user?.id;
  
  // First get the task details to preserve important fields
  const { data: taskData, error: fetchError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();
    
  if (fetchError) {
    console.error("Error fetching task details before assignment:", fetchError);
    throw fetchError;
  }
  
  // Update the task with the assignee ID
  const { error } = await supabase
    .from('tasks')
    .update({ 
      assignee_id: staffId,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId);
  
  if (error) {
    console.error("Error assigning task:", error);
    throw error;
  }
  
  console.log(`Task ${taskId} successfully assigned to staff ${staffId}`);
  
  // Send notification to the assignee
  try {
    await createNotification(
      staffId,
      "Task Assigned",
      "You have been assigned a new task",
      "task_assigned",
      taskId,
      "task"
    );
    
    console.log("Task assignment notification sent");
  } catch (notifyError) {
    console.error("Failed to send assignment notification:", notifyError);
    // Don't throw here - the task was assigned successfully
  }
}
