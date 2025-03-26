
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Claims a task that was marked as a team task by setting the assignee_id
 * This connects the team task to the staff member's account
 */
export async function claimDelegatedTask(taskId: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to claim a task");
    }
    
    console.log(`Attempting to claim task ${taskId} for staff member ${session.user.id}`);
    
    // Check if the task exists and is a team task
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('is_team_task', true)
      .maybeSingle();
      
    if (taskError) {
      console.error("Error checking task:", taskError);
      throw taskError;
    }
    
    if (!taskData) {
      console.error("Task not found or not a team task");
      throw new Error("This task is not available for claiming");
    }
    
    // Check if the task is already assigned
    if (taskData.assignee_id) {
      throw new Error("This task has already been claimed by someone else");
    }
    
    console.log("Task found, claiming now...");
    
    // Update the task to set the assignee_id to the current user
    const { error: updateError } = await supabase
      .from('tasks')
      .update({ 
        assignee_id: session.user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);
      
    if (updateError) {
      console.error("Error claiming task:", updateError);
      throw updateError;
    }
    
    console.log("Task claimed successfully");
    
    // Create a notification for the task creator
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: taskData.user_id,
          title: "Task Claimed",
          content: `A team task "${taskData.title}" has been claimed by a staff member`,
          type: "task_claimed",
          related_entity_id: taskId,
          related_entity_type: "task"
        });
    } catch (notifyError) {
      console.error("Failed to create notification:", notifyError);
      // Don't fail the whole operation if notification fails
    }
    
    return true;
  } catch (error) {
    console.error("Error in claimDelegatedTask:", error);
    
    toast({
      title: "Failed to claim task",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    
    return false;
  }
}
