
import { TaskStatus, TaskPriority, ArchiveReason } from "@/types/task.types";

export function validateTaskStatus(status: string | null | undefined): TaskStatus {
  const validStatuses: TaskStatus[] = ["pending", "in-progress", "completed", "late", "snoozed", "archived"];
  
  if (!status || !validStatuses.includes(status as TaskStatus)) {
    return "pending";
  }
  
  return status as TaskStatus;
}

export function validateTaskPriority(priority: string | null | undefined): TaskPriority {
  const validPriorities: TaskPriority[] = ["urgent", "high", "medium", "normal"];
  
  if (!priority || !validPriorities.includes(priority as TaskPriority)) {
    return "normal";
  }
  
  return priority as TaskPriority;
}

export function validateArchiveReason(reason: string | null | undefined): ArchiveReason | null {
  if (!reason) return null;
  
  const validReasons: ArchiveReason[] = ["deleted", "canceled"];
  if (validReasons.includes(reason as ArchiveReason)) {
    return reason as ArchiveReason;
  }
  
  return null;
}
