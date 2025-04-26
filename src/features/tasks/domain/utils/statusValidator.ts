
import { TaskStatus, TaskPriority } from "../types";

/**
 * Validates task status, returning a default if invalid
 */
export function validateTaskStatus(status: string | null | undefined): string {
  const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled', 'late', 'snoozed'];
  
  if (!status || !validStatuses.includes(status)) {
    return 'pending';
  }
  
  return status;
}

/**
 * Validates task priority, returning a default if invalid
 */
export function validateTaskPriority(priority: string | null | undefined): string {
  const validPriorities = ['low', 'normal', 'medium', 'high', 'urgent'];
  
  if (!priority || !validPriorities.includes(priority)) {
    return 'normal';
  }
  
  return priority;
}
