
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData, SubTask, TaskStatus, TaskPriority } from "@/types/task.types";
import { createNewTask } from "./baseService";
import { RecurringFormData, EntityType } from "@/types/recurring.types";
import { createRecurringSetting, generateRecurringDates } from "@/services/recurring/recurringService";
import { validateTaskStatus, validateTaskPriority } from "./utils/statusValidator";
import { sanitizeTaskData } from "./utils/validateTaskData";

// Create a new task
export async function createTask(taskData: TaskFormData, recurringData?: RecurringFormData): Promise<Task> {
  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required to create tasks");
  }

  console.log("Task data before cleaning:", taskData);
  
  // Create a clean task data object, removing properties that don't belong in the tasks table
  const cleanTaskData = sanitizeTaskData(taskData);
  
  // Add the is_recurring flag from recurring data
  if (recurringData) {
    cleanTaskData.is_recurring = true;
  }
  
  console.log("Clean task data being sent to database:", cleanTaskData);
  
  // Create the new task using the base service with cleaned data
  const task = await createNewTask(session.user.id, cleanTaskData);
  
  // If there are subtasks, create them
  if (taskData.subtasks && taskData.subtasks.length > 0) {
    await createSubtasks(task.id, taskData.subtasks);
  }
  
  // If recurring data is provided, create recurring settings
  if (recurringData && task) {
    try {
      await createRecurringSetting({
        entity_id: task.id,
        entity_type: 'task' as EntityType,
        created_by: session.user.id,
        frequency: recurringData.frequency!,
        interval: recurringData.interval!,
        days_of_week: recurringData.days_of_week,
        day_of_month: recurringData.day_of_month,
        end_date: recurringData.end_date,
        max_occurrences: recurringData.max_occurrences
      });
      
      // If there's a due date and we need to generate recurring instances
      if (taskData.due_date && recurringData.frequency) {
        // We might want to create future recurring instances here
        // This is a more complex feature that would involve creating multiple tasks
        // and setting their is_recurring_instance flag to true
      }
    } catch (error: any) {
      // Log the error but don't fail the task creation
      console.error("Failed to create recurring settings:", error);
      
      if (error.message === "This feature is only available for paid accounts") {
        throw error; // Re-throw this specific error to handle in the UI
      }
    }
  }
  
  return task;
}

// Create subtasks for a task
async function createSubtasks(taskId: string, subtasks: SubTask[]): Promise<void> {
  if (!subtasks.length) return;
  
  const subtasksToCreate = subtasks.map(subtask => ({
    task_id: taskId,
    content: subtask.content,
    is_completed: subtask.is_completed || false,
    due_date: subtask.due_date || null,
    due_time: subtask.due_time || null
  }));
  
  console.log("Creating subtasks with data:", subtasksToCreate);
  
  const { data, error } = await supabase
    .from('todo_items')
    .insert(subtasksToCreate);
    
  if (error) {
    console.error("Failed to create subtasks:", error);
    throw error;
  }
  
  console.log("Subtasks created successfully:", data);
}

// Create recurring task instances
export async function createRecurringTaskInstances(
  originalTaskId: string,
  dates: Date[]
): Promise<Task[]> {
  const { data: originalTask, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', originalTaskId)
    .single();
    
  if (taskError) throw taskError;
  
  const createdTasks: Task[] = [];
  
  for (const date of dates) {
    const newTaskData = {
      title: originalTask.title,
      description: originalTask.description,
      priority: originalTask.priority,
      status: 'pending',
      due_date: date.toISOString(),
      due_time: originalTask.due_time || null,
      user_id: originalTask.user_id,
      is_recurring_instance: true,
      parent_recurring_id: originalTaskId
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(newTaskData)
      .select()
      .single();
      
    if (error) {
      console.error("Failed to create recurring task instance:", error);
    } else if (data) {
      // Explicitly create a properly typed Task object
      const task: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: validateTaskStatus(data.status || "pending") as TaskStatus,
        priority: validateTaskPriority(data.priority || "normal") as TaskPriority,
        due_date: data.due_date,
        due_time: data.due_time || null,
        completed_at: data.completed_at || null,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        is_recurring_instance: data.is_recurring_instance || false,
        parent_recurring_id: data.parent_recurring_id || null,
        snooze_count: data.snooze_count || 0,
        snoozed_until: data.snoozed_until || null
      };
      
      createdTasks.push(task);
    }
  }
  
  return createdTasks;
}
