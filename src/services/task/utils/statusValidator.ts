
import { TaskStatus, TaskPriority } from "@/types/task.types";

// Validate task status to ensure it's one of the allowed values
export function validateTaskStatus(status: string | undefined): TaskStatus {
  if (!status) return "pending";
  
  const validStatuses: TaskStatus[] = ["pending", "in-progress", "completed", "late"];
  
  if (validStatuses.includes(status as TaskStatus)) {
    return status as TaskStatus;
  }
  
  return "pending";
}

// Validate task priority to ensure it's one of the allowed values
export function validateTaskPriority(priority: string | undefined): TaskPriority {
  if (!priority) return "normal";
  
  const validPriorities: TaskPriority[] = ["urgent", "high", "medium", "normal"];
  
  if (validPriorities.includes(priority as TaskPriority)) {
    return priority as TaskPriority;
  }
  
  return "normal";
}
