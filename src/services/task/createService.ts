
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData, SubTask } from "./types";
import { createNewTask } from "./baseService";
import { RecurringFormData, EntityType } from "@/types/recurring.types";
import { createRecurringSetting, generateRecurringDates } from "@/services/recurring/recurringService";

// Create a new task
export async function createTask(taskData: TaskFormData, recurringData?: RecurringFormData): Promise<Task> {
  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required to create tasks");
  }

  // Create the new task using the base service
  const task = await createNewTask(session.user.id, taskData);
  
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
  
  const { error } = await supabase
    .from('todo_items')
    .insert(subtasksToCreate);
    
  if (error) {
    console.error("Failed to create subtasks:", error);
    throw error;
  }
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
      due_time: originalTask.due_time,
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
      createdTasks.push(data as Task);
    }
  }
  
  return createdTasks;
}
