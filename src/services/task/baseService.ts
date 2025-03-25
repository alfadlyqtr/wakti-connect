
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData } from "./types";

// Create a new task base service function
export async function createNewTask(userId: string, taskData: Partial<TaskFormData>): Promise<Task> {
  // Prepare the new task object with basic properties
  const newTask = {
    user_id: userId,
    title: taskData.title,
    description: taskData.description || null,
    status: taskData.status || "pending",
    priority: taskData.priority || "normal",
    due_date: taskData.due_date || null,
    due_time: taskData.due_time || null,
    assignee_id: taskData.assignee_id || null
  };

  // Insert the task data
  const { data, error } = await supabase
    .from('tasks')
    .insert(newTask)
    .select();

  if (error) {
    throw error;
  }
  
  return data[0] as Task;
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
  
  // Combine the data with proper typing
  const result: Task = {
    ...taskData,
    due_time: taskData.due_time || null,
    subtasks: subtasksData || []
  } as Task;
  
  return result;
}
