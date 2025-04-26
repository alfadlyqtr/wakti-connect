
export type TaskStatus = "pending" | "in-progress" | "completed" | "cancelled" | "late" | "snoozed";
export type TaskPriority = "low" | "normal" | "medium" | "high" | "urgent";

export interface SubTask {
  id: string;
  task_id: string;
  content: string;
  is_completed: boolean;
  due_date?: string | null;
  due_time?: string | null;
  is_group?: boolean;
  parent_id?: string | null;
  title?: string | null;
  created_at: string;
  updated_at: string;
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
  updated_at: string;
  completed_at?: string | null;
  is_recurring_instance?: boolean;
  parent_recurring_id?: string | null;
  snooze_count?: number;
  snoozed_until?: string | null;
  archived_at?: string | null;
  archive_reason?: string | null;
  subtasks?: SubTask[];
}

export interface TaskFormData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  due_time?: string | null;
  subtasks?: Partial<SubTask>[];
  location?: string;
  preserveNestedStructure?: boolean;
  originalSubtasks?: any;
}

export type TaskWithSharedInfo = Task & {
  is_shared?: boolean;
  original_owner_id?: string;
};

export type TaskTab = "my-tasks" | "shared" | "assigned" | "team" | "archived" | "reminders";
