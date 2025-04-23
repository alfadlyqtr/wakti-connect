
// Add or verify TaskTab type is exported from this file
export type TaskStatus = "pending" | "in-progress" | "completed" | "snoozed" | "archived" | "late";
export type TaskPriority = "urgent" | "high" | "medium" | "normal";
export type TaskTab = "my-tasks" | "archived" | "reminders";
export type ArchiveReason = "deleted" | "canceled";

export interface SubTask {
  id: string;
  task_id: string;
  content: string;
  is_completed: boolean;
  due_date?: string | null;
  due_time?: string | null;
  is_group?: boolean;
  parent_id?: string | null;
  subtasks?: SubTask[];  // Recursive structure for nested subtasks
  title?: string;  // Title specifically for group subtasks
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  due_time?: string | null;
  user_id: string;
  created_at: string;
  updated_at?: string | null;
  completed_at?: string | null;
  is_recurring?: boolean;
  is_recurring_instance?: boolean;
  parent_recurring_id?: string | null;
  subtasks?: SubTask[];
  snooze_count?: number;
  snoozed_until?: string | null;
  archived_at?: string | null;
  archive_reason?: ArchiveReason | null;
  location?: string | null;
  originalSubtasks?: any[];  // Keep this as any[] for backward compatibility
}

export interface TaskFormData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  due_time?: string | null;
  subtasks?: SubTask[];
  snooze_count?: number;
  snoozed_until?: string | null;
  is_recurring?: boolean;
  archived_at?: string | null;
  archive_reason?: ArchiveReason | null;
  location?: string | null;
  originalSubtasks?: any[];
  preserveNestedStructure?: boolean;
}

