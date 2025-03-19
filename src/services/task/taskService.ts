
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Task, SubTask } from "./types";

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

/**
 * Add a subtask to a task
 */
export async function addSubtask(taskId: string, content: string): Promise<SubTask | null> {
  try {
    const { data, error } = await supabase
      .from('todo_items')
      .insert({
        task_id: taskId,
        content: content,
        is_completed: false
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data as SubTask;
  } catch (error: any) {
    console.error("Error adding subtask:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to add subtask",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Get task by ID for viewing details
 */
export async function getTaskById(taskId: string): Promise<Task | null> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks:todo_items(*)
      `)
      .eq('id', taskId)
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      subtasks: Array.isArray(data.subtasks) ? data.subtasks : []
    } as Task;
  } catch (error: any) {
    console.error("Error fetching task:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to fetch task details",
      variant: "destructive",
    });
    return null;
  }
}
