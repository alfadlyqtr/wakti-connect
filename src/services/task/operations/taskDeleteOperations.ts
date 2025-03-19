
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    // First delete all subtasks
    const { error: subtasksError } = await supabase
      .from('todo_items')
      .delete()
      .eq('task_id', taskId);
      
    if (subtasksError) throw subtasksError;
    
    // Delete any shared task entries
    const { error: sharedError } = await supabase
      .from('shared_tasks')
      .delete()
      .eq('task_id', taskId);
      
    if (sharedError) throw sharedError;
    
    // Finally delete the task itself
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error deleting task:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to delete task",
      variant: "destructive",
    });
    return false;
  }
}
