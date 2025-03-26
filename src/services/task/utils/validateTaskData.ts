
import { TaskFormData, TaskStatus, TaskPriority } from "@/types/task.types";
import { validateTaskStatus, validateTaskPriority } from "./statusValidator";

/**
 * Sanitizes and validates task data to ensure only appropriate properties are passed to database
 */
export function sanitizeTaskData(taskData: TaskFormData): Partial<TaskFormData> {
  // Create a clean task data object with only the fields that belong in the tasks table
  const cleanTaskData: Partial<TaskFormData> = {
    title: taskData.title,
    description: taskData.description || null,
    status: validateTaskStatus(taskData.status || "pending") as TaskStatus,
    priority: validateTaskPriority(taskData.priority || "normal") as TaskPriority,
    due_date: taskData.due_date || null,
    due_time: taskData.due_time || null,
    is_recurring: taskData.is_recurring || false,
    snooze_count: taskData.snooze_count || 0,
    snoozed_until: taskData.snoozed_until || null
  };
  
  return cleanTaskData;
}
