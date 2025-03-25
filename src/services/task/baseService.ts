
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData, TaskStatus, TaskPriority } from "./types";
import { validateTaskStatus, validateTaskPriority } from "./utils/statusValidator";

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
    console.error("Error creating task:", error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    throw new Error("No data returned from task creation");
  }
  
  // Explicitly extract properties and add defaults for any missing ones
  const taskItem = data[0];
  const task: Task = {
    id: taskItem.id,
    title: taskItem.title,
    description: taskItem.description,
    status: validateTaskStatus(taskItem.status || "pending") as TaskStatus,
    priority: validateTaskPriority(taskItem.priority || "normal") as TaskPriority,
    due_date: taskItem.due_date,
    // Handle potentially missing properties
    due_time: taskItem.due_time || null,
    user_id: taskItem.user_id,
    assignee_id: taskItem.assignee_id || null,
    created_at: taskItem.created_at,
    updated_at: taskItem.updated_at,
    completed_at: taskItem.completed_at || null,
    is_recurring_instance: taskItem.is_recurring_instance || false,
    parent_recurring_id: taskItem.parent_recurring_id || null,
    snooze_count: taskItem.snooze_count || 0,
    snoozed_until: taskItem.snoozed_until || null
  };
  
  return task;
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
    id: taskData.id,
    title: taskData.title,
    description: taskData.description,
    status: validateTaskStatus(taskData.status || "pending") as TaskStatus,
    priority: validateTaskPriority(taskData.priority || "normal") as TaskPriority,
    due_date: taskData.due_date,
    // Handle potentially missing properties
    due_time: taskData.due_time || null,
    completed_at: taskData.completed_at || null,
    user_id: taskData.user_id,
    assignee_id: taskData.assignee_id || null,
    created_at: taskData.created_at,
    updated_at: taskData.updated_at,
    is_recurring_instance: taskData.is_recurring_instance || false,
    parent_recurring_id: taskData.parent_recurring_id || null,
    snooze_count: taskData.snooze_count || 0,
    snoozed_until: taskData.snoozed_until || null,
    subtasks: subtasksData || []
  };
  
  return result;
}
