
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
