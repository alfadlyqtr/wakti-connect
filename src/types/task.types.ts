
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  due_time: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  is_recurring?: boolean;
  is_recurring_instance?: boolean;
  parent_recurring_id?: string | null;
  subtasks?: SubTask[];
  snooze_count?: number;
  snoozed_until?: string | null;
  archived_at?: string | null;
  archive_reason?: ArchiveReason | null;
}

export interface SubTask {
  id?: string;
  content: string;
  is_completed: boolean;
  task_id?: string;
  due_date?: string | null;
  due_time?: string | null;
}

export type TaskStatus = "in-progress" | "completed" | "late" | "snoozed" | "archived";
export type TaskPriority = "urgent" | "high" | "medium" | "normal";
export type TaskTab = "my-tasks" | "archived";
export type ArchiveReason = "deleted" | "canceled";

export interface TaskFormData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  due_time?: string;
  subtasks?: SubTask[];
  snooze_count?: number;
  snoozed_until?: string | null;
  is_recurring?: boolean;
}
