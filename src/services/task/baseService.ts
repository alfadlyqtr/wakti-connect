
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
