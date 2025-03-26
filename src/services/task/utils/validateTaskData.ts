
import { TaskFormData } from "@/types/task.types";

/**
 * Sanitizes and validates task data before database operations
 * Removes fields that should not be stored directly in the tasks table
 */
export function sanitizeTaskData(taskData: TaskFormData): Partial<TaskFormData> {
  // Create a clean object with only the fields that belong in the tasks table
  return {
    title: taskData.title,
    description: taskData.description,
    status: taskData.status || "pending",
    priority: taskData.priority || "normal",
    due_date: taskData.due_date,
    due_time: taskData.due_time,
    snooze_count: taskData.snooze_count || 0,
    snoozed_until: taskData.snoozed_until || null,
    is_recurring: taskData.is_recurring || false
  };
}
