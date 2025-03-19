
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { TaskStatus } from "@/types/task.types";

/**
 * Mark a task as complete
 */
export async function markTaskComplete(taskId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error marking task as complete:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to mark task as complete",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Mark a task as pending
 */
export async function markTaskPending(taskId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error marking task as pending:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to mark task as pending",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Update a task's status
 */
export async function updateTaskStatus(taskId: string, status: string): Promise<boolean> {
  try {
    const validStatus = ['pending', 'in-progress', 'completed', 'late'].includes(status)
      ? status as TaskStatus
      : 'pending';
    
    const { error } = await supabase
      .from('tasks')
      .update({ 
        status: validStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error updating task status:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to update task status",
      variant: "destructive",
    });
    return false;
  }
}
