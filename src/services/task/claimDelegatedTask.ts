
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
    
    // Get the current user's email
    const { data: authUser } = await supabase.auth.admin.getUserById(session.user.id);
    const userEmail = authUser?.user?.email;
    
    if (!userEmail) {
      throw new Error("Could not determine your email address");
    }
    
    // Check if the task is delegated to this email
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('delegated_email', userEmail)
      .single();
      
    if (taskError) {
      console.error("Error checking task:", taskError);
      return false;
    }
    
    if (!taskData) {
      console.error("Task not found or not delegated to this email");
      return false;
    }
    
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
    
    toast({
      title: "Task claimed",
      description: "You have successfully claimed this task.",
    });
    
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
