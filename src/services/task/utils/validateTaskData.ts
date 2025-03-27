
import { TaskFormData, TaskStatus, ArchiveReason } from "@/types/task.types";

/**
 * Sanitizes and validates task data before database operations
 * Removes fields that should not be stored directly in the tasks table
 */
export function sanitizeTaskData(taskData: TaskFormData): Partial<TaskFormData> {
  // Create a clean object with only the fields that belong in the tasks table
  return {
    title: taskData.title,
    description: taskData.description,
    status: validateTaskStatus(taskData.status),
    priority: taskData.priority || "normal",
    due_date: taskData.due_date,
    due_time: taskData.due_time,
    snooze_count: taskData.snooze_count || 0,
    snoozed_until: taskData.snoozed_until || null,
    is_recurring: taskData.is_recurring || false,
    archived_at: taskData.archived_at || null,
    archive_reason: validateArchiveReason(taskData.archive_reason)
  };
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
