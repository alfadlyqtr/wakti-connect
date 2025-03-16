
import { TaskStatus, TaskPriority } from "../types";

/**
 * Validates and normalizes task status values
 * @param status Any potential status value
 * @returns Valid TaskStatus or "pending" as default
 */
export function validateTaskStatus(status: any): TaskStatus {
  const validStatuses: TaskStatus[] = ["pending", "in-progress", "completed", "late"];
  
  if (status && validStatuses.includes(status as TaskStatus)) {
    return status as TaskStatus;
  }
  
  // Default to "pending" if status is invalid
  return "pending";
}

/**
 * Validates and normalizes task priority values
 * @param priority Any potential priority value
 * @returns Valid TaskPriority or "normal" as default
 */
export function validateTaskPriority(priority: any): TaskPriority {
  const validPriorities: TaskPriority[] = ["urgent", "high", "medium", "normal"];
  
  if (priority && validPriorities.includes(priority as TaskPriority)) {
    return priority as TaskPriority;
  }
  
  // Default to "normal" if priority is invalid
  return "normal";
}
