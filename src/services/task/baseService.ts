import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData, TaskPriority, TaskStatus } from "@/types/task.types";

/**
 * Create a new task with the given data
 * @param taskData The data for the new task
 * @returns The newly created task
 */
export async function createTask(taskData: {
  user_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  assignee_id: string;
}): Promise<Task> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert(taskData)
      .select("*")
      .single();

    if (error) {
      console.error("Error creating task:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error("Error in createTask:", error);
    throw new Error(`Failed to create task: ${error.message}`);
  }
}

// Get task with subtasks
export async function getTaskWithSubtasks(taskId: string): Promise<Task> {
  // First get the task
  const { data: taskData, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();
    
  if (taskError) throw taskError;
  
  // Then get any subtasks
  const { data: subtasksData, error: subtasksError } = await supabase
    .from('todo_items')
    .select('*')
    .eq('task_id', taskId);
    
  if (subtasksError) throw subtasksError;
  
  // Combine the data
  return {
    ...taskData,
    subtasks: subtasksData || []
  } as Task;
}
