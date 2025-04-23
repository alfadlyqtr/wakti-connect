
import { TaskFormData, TaskStatus, ArchiveReason } from "@/types/task.types";

/**
 * Sanitizes and validates task data before database operations
 * Removes fields that should not be stored directly in the tasks table
 */
export function sanitizeTaskData(taskData: TaskFormData): Partial<TaskFormData> {
  // Create a clean object with only the fields that belong in the tasks table
  const sanitized: Partial<TaskFormData> = {
    title: taskData.title,
    description: taskData.description,
    status: validateTaskStatus(taskData.status),
    priority: taskData.priority || "normal",
    due_date: taskData.due_date,
    due_time: taskData.due_time,
    location: taskData.location
  };
  
  // Add optional fields when present in the input
  if ('snooze_count' in taskData) {
    sanitized.snooze_count = taskData.snooze_count || 0;
  }
  
  if ('snoozed_until' in taskData) {
    sanitized.snoozed_until = taskData.snoozed_until || null;
  }
  
  if ('isRecurring' in taskData) {
    sanitized.isRecurring = taskData.isRecurring || false;
  }
  
  if ('archived_at' in taskData) {
    sanitized.archived_at = taskData.archived_at || null;
  }
  
  if ('archive_reason' in taskData) {
    sanitized.archive_reason = validateArchiveReason(taskData.archive_reason);
  }
  
  return sanitized;
}

function validateTaskStatus(status?: TaskStatus): TaskStatus {
  if (!status) return "pending";
  return status;
}

export function validateArchiveReason(reason?: string | ArchiveReason): ArchiveReason | null {
  if (!reason) return null;
  
  // Verify that the reason is a valid ArchiveReason
  const validReasons: ArchiveReason[] = ["deleted", "canceled"];
  if (validReasons.includes(reason as ArchiveReason)) {
    return reason as ArchiveReason;
  }
  
  return null;
}
