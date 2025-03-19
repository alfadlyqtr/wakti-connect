
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    // First, delete any subtasks associated with this task
    const { error: subtaskError } = await supabase
      .from('todo_items')
      .delete()
      .eq('task_id', taskId);
    
    if (subtaskError) throw subtaskError;
    
    // Then delete the task itself
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
      description: "Failed to delete task",
      variant: "destructive",
    });
    return false;
  }
}
