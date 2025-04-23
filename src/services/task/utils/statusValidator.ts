
import { TaskStatus, TaskPriority } from "@/types/task.types";

/**
 * Validates and normalizes task status
 */
export function validateTaskStatus(status?: any): TaskStatus {
  if (!status) return "pending";
  
  const validStatuses: TaskStatus[] = [
    "pending", "in-progress", "completed", "snoozed", "archived", "late"
  ];
  
  if (validStatuses.includes(status as TaskStatus)) {
    return status as TaskStatus;
  }
  
  return "pending";
}

/**
 * Validates and normalizes task priority
 */
export function validateTaskPriority(priority?: any): TaskPriority {
  if (!priority) return "normal";
  
  const validPriorities: TaskPriority[] = [
    "urgent", "high", "medium", "normal"
  ];
  
  if (validPriorities.includes(priority as TaskPriority)) {
    return priority as TaskPriority;
  }
  
  return "normal";
}
