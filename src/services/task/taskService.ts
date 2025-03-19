
import { supabase } from "@/integrations/supabase/client";
import { Task, SubTask } from "@/types/task.types";
import { toast } from "@/components/ui/use-toast";
import { getTaskById, getUpcomingTasks } from "./operations/taskRetrievalOperations";

/**
 * Mark a task as complete
 */
export async function markTaskComplete(taskId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', taskId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error marking task complete:", error);
    toast({
      title: "Error",
      description: "Failed to mark task as complete",
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
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'pending', updated_at: new Date().toISOString() })
      .eq('id', taskId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error marking task pending:", error);
    toast({
      title: "Error",
      description: "Failed to mark task as pending",
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

/**
 * Add a subtask to a task
 */
export async function addSubtask(taskId: string, content: string): Promise<SubTask | null> {
  try {
    const { data, error } = await supabase
      .from('todo_items')
      .insert({
        task_id: taskId,
        content,
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
      description: "Failed to add subtask",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Update a subtask status
 */
export async function updateSubtaskStatus(subtaskId: string, isCompleted: boolean): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('todo_items')
      .update({ is_completed: isCompleted, updated_at: new Date().toISOString() })
      .eq('id', subtaskId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error updating subtask status:", error);
    toast({
      title: "Error",
      description: "Failed to update subtask status",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Delete a subtask
 */
export async function deleteSubtask(subtaskId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('todo_items')
      .delete()
      .eq('id', subtaskId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error deleting subtask:", error);
    toast({
      title: "Error",
      description: "Failed to delete subtask",
      variant: "destructive",
    });
    return false;
  }
}

// Re-export task retrieval functions
export { getTaskById, getUpcomingTasks };
