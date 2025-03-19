
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { SubTask } from "../types";

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
    
    console.log("Subtask added successfully:", data);
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
 * Update a subtask's completion status
 */
export async function updateSubtaskStatus(subtaskId: string, isCompleted: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('todo_items')
      .update({ 
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      })
      .eq('id', subtaskId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error updating subtask status:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to update subtask status",
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
    const { error } = await supabase
      .from('todo_items')
      .delete()
      .eq('id', subtaskId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error deleting subtask:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to delete subtask",
      variant: "destructive",
    });
    return false;
  }
}
