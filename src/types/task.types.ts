
// Basic task status and priority types
export type TaskStatus = "pending" | "in-progress" | "completed" | "snoozed" | "archived" | "late";
export type TaskPriority = "urgent" | "high" | "medium" | "normal";
export type TaskTab = "my-tasks" | "archived" | "reminders";
export type ArchiveReason = "deleted" | "canceled";

// Subtask interface
export interface SubTask {
  id: string;
  task_id: string;
  content: string;
  is_completed: boolean;
  due_date?: string | null;
  due_time?: string | null;
}

// Main task interface
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
  subtasks?: SubTask[];
  archived_at?: string | null;
  archive_reason?: ArchiveReason | null;
  location?: string | null;
  is_recurring?: boolean;
  is_recurring_instance?: boolean;
  snooze_count?: number;
  snoozed_until?: string | null;
  parent_recurring_id?: string | null;
}

// Form data for creating/editing tasks
export interface TaskFormData {
  title: string;
  description?: string | null;
  priority: TaskPriority;
  due_date: string;
  due_time?: string | null;
  location?: string | null;
  subtasks?: {
    content: string;
    is_completed?: boolean;
    due_date?: string | null;
    due_time?: string | null;
  }[];
}
