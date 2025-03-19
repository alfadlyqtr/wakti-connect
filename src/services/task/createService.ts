
import { supabase } from "@/integrations/supabase/client";
import { TaskFormData, Task, SubTask } from "@/types/task.types";
import { createTask } from "./baseService";
import { RecurringFormData } from "@/types/recurring.types";

/**
 * Create a task with subtasks (if any)
 */
export async function createTaskWithSubtasks(taskData: TaskFormData, userId: string): Promise<Task> {
  try {
    const taskPayload = {
      user_id: userId,
      title: taskData.title,
      description: taskData.description || "",
      status: taskData.status || "pending",
      priority: taskData.priority || "normal",
      due_date: taskData.due_date || new Date().toISOString(),
      assignee_id: taskData.assignee_id || userId,
    };
    
    // Create the task first
    const task = await createTask(taskPayload);
    
    // If there are subtasks, create them
    if (taskData.subtasks && taskData.subtasks.length > 0) {
      await createSubtasks(task.id, taskData.subtasks);
    }
    
    return task;
  } catch (error: any) {
    console.error("Error in createTaskWithSubtasks:", error);
    throw new Error(`Failed to create task: ${error.message}`);
  }
}

/**
 * Create subtasks for a given task
 * @param taskId The ID of the task to create subtasks for
 * @param subtasks The subtasks to create
 */
export async function createSubtasks(taskId: string, subtasks: SubTask[]): Promise<SubTask[]> {
  try {
    // Check if subtasks array is empty
    if (!subtasks || subtasks.length === 0) {
      return [];
    }
    
    const subtaskPayload = subtasks.map(subtask => ({
      task_id: taskId,
      content: subtask.content,
      is_completed: subtask.is_completed || false
    }));
    
    // Use the helper from util to handle dynamic table names
    const { data, error } = await supabase
      .from("todo_items")
      .insert(subtaskPayload)
      .select("*");
      
    if (error) {
      console.error("Error creating subtasks:", error);
      throw new Error(error.message);
    }
    
    // Ensure the data is properly typed
    return (data || []).map(item => ({
      id: item.id,
      task_id: item.task_id,
      content: item.content,
      is_completed: item.is_completed || false,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (error: any) {
    console.error("Error in createSubtasks:", error);
    throw new Error(`Failed to create subtasks: ${error.message}`);
  }
}

/**
 * Create a recurring task
 * @param taskData The data for the recurring task
 * @param userId The ID of the user creating the task
 * @param recurringData The data for the recurrence
 */
export async function createRecurringTask(
  taskData: TaskFormData, 
  userId: string, 
  recurringData: RecurringFormData
): Promise<Task[]> {
  try {
    // Check if the user has a paid account
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      throw new Error(profileError.message);
    }
    
    const isPaidAccount = profile?.account_type === "individual" || profile?.account_type === "business";
    
    if (!isPaidAccount) {
      throw new Error("This feature is only available for paid accounts");
    }
    
    // Create the initial task
    const initialTask = await createTaskWithSubtasks(taskData, userId);
    
    // Create the recurrence
    const recurrencePayload = {
      task_id: initialTask.id,
      frequency: recurringData.frequency,
      interval: recurringData.interval,
      end_date: recurringData.end_date ? recurringData.end_date.toISOString() : null,
      max_occurrences: recurringData.max_occurrences || null,
      days_of_week: recurringData.days_of_week || null,
      entity_id: initialTask.id,
      entity_type: "task",
      created_by: userId
    };
    
    // Use our helper to handle dynamic table insertion
    const { data: recurrence, error: recurrenceError } = await supabase
      .from("recurrences")
      .insert(recurrencePayload)
      .select("*")
      .single();
      
    if (recurrenceError) {
      console.error("Error creating recurrence:", recurrenceError);
      throw new Error(recurrenceError.message);
    }
    
    return [initialTask];
  } catch (error: any) {
    console.error("Error in createRecurringTask:", error);
    throw new Error(`Failed to create recurring task: ${error.message}`);
  }
}

// Export the task creation functions
export { createTaskWithSubtasks as createTask };
