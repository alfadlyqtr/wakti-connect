
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
  
  // Explicitly extract properties and add defaults for any missing ones
  const task: Task = {
    id: data[0].id,
    title: data[0].title,
    description: data[0].description,
    status: data[0].status,
    priority: data[0].priority,
    due_date: data[0].due_date,
    due_time: data[0].due_time || null,
    completed_at: data[0].completed_at || null,
    user_id: data[0].user_id,
    assignee_id: data[0].assignee_id || null,
    created_at: data[0].created_at,
    updated_at: data[0].updated_at,
    is_recurring_instance: data[0].is_recurring_instance || false,
    parent_recurring_id: data[0].parent_recurring_id || null,
    snooze_count: data[0].snooze_count || 0,
    snoozed_until: data[0].snoozed_until || null
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
    status: taskData.status,
    priority: taskData.priority,
    due_date: taskData.due_date,
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
