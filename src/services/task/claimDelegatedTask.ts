
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Claims a task that was delegated by email by setting the assignee_id
 * This connects the email-delegated task to the staff member's account
 */
export async function claimDelegatedTask(taskId: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to claim a task");
    }
    
    // Get the current user's email from auth.users directly
    const { data: authUser } = await supabase.auth.getUser();
    const userEmail = authUser.user?.email;
    
    if (!userEmail) {
      throw new Error("Could not determine your email address");
    }
    
    console.log(`Attempting to claim task ${taskId} for user ${session.user.id} with email ${userEmail}`);
    
    // Check if the task is delegated to this email
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('delegated_email', userEmail)
      .maybeSingle();
      
    if (taskError) {
      console.error("Error checking task:", taskError);
      throw taskError;
    }
    
    if (!taskData) {
      console.error("Task not found or not delegated to this email");
      throw new Error("This task is not delegated to your email address");
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
          content: `A delegated task "${taskData.title}" has been claimed`,
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
