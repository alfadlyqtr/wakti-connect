
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

/**
 * Get upcoming tasks for dashboard
 */
export async function getUpcomingTasks(): Promise<Task[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return [];
    }
    
    // Get tasks due in the next 7 days
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks:todo_items(*)
      `)
      .eq('user_id', session.user.id)
      .lte('due_date', nextWeek.toISOString())
      .gte('due_date', today.toISOString())
      .neq('status', 'completed')
      .order('due_date', { ascending: true });
      
    if (error) throw error;
    
    // Transform data with proper typing and ensure subtasks is always an array
    return (data || []).map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as Task["status"],
      priority: task.priority as Task["priority"],
      due_date: task.due_date,
      user_id: task.user_id,
      assignee_id: task.assignee_id || null,
      created_at: task.created_at,
      updated_at: task.updated_at,
      is_recurring_instance: task.is_recurring_instance || false,
      parent_recurring_id: task.parent_recurring_id || null,
      subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
    }));
    
  } catch (error: any) {
    console.error("Error fetching upcoming tasks:", error);
    return [];
  }
}
