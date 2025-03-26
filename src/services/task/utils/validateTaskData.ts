
import { TaskFormData } from "@/types/task.types";

/**
 * Validates and sanitizes task data to ensure it only contains
 * properties that can be stored in the database tasks table
 */
export function sanitizeTaskData(taskData: TaskFormData): Partial<TaskFormData> {
  // Extract only valid database fields from the input data
  const sanitizedData: Partial<TaskFormData> = {
    title: taskData.title,
    description: taskData.description,
    status: taskData.status,
    priority: taskData.priority,
    due_date: taskData.due_date,
    due_time: taskData.due_time,
    assignee_id: taskData.assignee_id,
    // Do not include enableSubtasks as it's not a database field
  };

  return sanitizedData;
}
