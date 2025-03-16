
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Share a task with another user
export async function shareTask(taskId: string, userId: string): Promise<boolean> {
  try {
    // Check if the sharing already exists
    const { data: existingShare } = await supabase
      .from('shared_tasks')
      .select('*')
      .eq('task_id', taskId)
      .eq('shared_with', userId)
      .single();

    if (existingShare) {
      toast({
        title: "Already shared",
        description: "This task is already shared with this user",
      });
      return true;
    }

    // Share the task
    const { error } = await supabase
      .from('shared_tasks')
      .insert({
        task_id: taskId,
        shared_with: userId
      });

    if (error) throw error;

    toast({
      title: "Task shared successfully",
      description: "The user can now access this task",
    });
    
    return true;
  } catch (error) {
    console.error("Error sharing task:", error);
    toast({
      title: "Failed to share task",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
}

// Assign a task to a staff member
export async function assignTask(taskId: string, staffId: string): Promise<boolean> {
  try {
    // Get the current task to make sure it exists
    const { data: taskData, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (fetchError) throw fetchError;

    // Update the task with an assignee
    const { error } = await supabase
      .from('tasks')
      .update({ 
        assignee_id: staffId,
        // Include existing values to avoid losing data
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.due_date,
        user_id: taskData.user_id
      })
      .eq('id', taskId);

    if (error) throw error;

    toast({
      title: "Task assigned successfully",
      description: "The staff member can now access this task",
    });

    return true;
  } catch (error) {
    console.error("Error assigning task:", error);
    toast({
      title: "Failed to assign task",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
}

// Unshare a task with a user
export async function unshareTask(taskId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shared_tasks')
      .delete()
      .eq('task_id', taskId)
      .eq('shared_with', userId);

    if (error) throw error;

    toast({
      title: "Task unshared",
      description: "The user no longer has access to this task",
    });
    
    return true;
  } catch (error) {
    console.error("Error unsharing task:", error);
    toast({
      title: "Failed to unshare task",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
}
