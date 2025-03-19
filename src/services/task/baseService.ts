
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

    // Ensure the returned data conforms to Task type
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as TaskStatus,
      priority: data.priority as TaskPriority,
      due_date: data.due_date,
      user_id: data.user_id,
      assignee_id: data.assignee_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_recurring_instance: data.is_recurring_instance || false,
      parent_recurring_id: data.parent_recurring_id || null,
      subtasks: []
    };
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
  
  // Combine the data and ensure the task conforms to Task type
  return {
    id: taskData.id,
    title: taskData.title,
    description: taskData.description,
    status: taskData.status as TaskStatus,
    priority: taskData.priority as TaskPriority,
    due_date: taskData.due_date,
    user_id: taskData.user_id,
    assignee_id: taskData.assignee_id,
    created_at: taskData.created_at,
    updated_at: taskData.updated_at,
    is_recurring_instance: taskData.is_recurring_instance || false,
    parent_recurring_id: taskData.parent_recurring_id || null,
    subtasks: subtasksData || []
  };
}
