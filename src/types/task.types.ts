// Basic task status and priority types
export type TaskStatus = "pending" | "in-progress" | "completed" | "snoozed" | "late" | "archived";
export type TaskPriority = "urgent" | "high" | "medium" | "normal";
export type TaskTab = "my-tasks" | "completed" | "reminders";
export type ArchiveReason = "deleted" | "canceled" | string;

// Interface for nested subtasks used by AI parsing
export interface NestedSubtask {
  id?: string;
  content: string;
  title?: string;
  is_completed?: boolean;
  subtasks?: (string | NestedSubtask)[];
}

// Subtask interface
export interface SubTask {
  id?: string;
  task_id?: string;
  content: string;
  is_completed: boolean;
  due_date?: string | null;
  due_time?: string | null;
  
  // Additional properties needed by AI components
  title?: string;
  parent_id?: string;
  is_group?: boolean;
  subtasks?: SubTask[];
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
  
  // Additional properties needed by components
  isRecurring?: boolean;
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
  status?: TaskStatus;
  
  // Additional fields for TaskFormSchema
  enableSubtasks?: boolean;
  isRecurring?: boolean;
  is_recurring?: boolean;
  
  // Fields for AI components
  preserveNestedStructure?: boolean;
  originalSubtasks?: (string | SubTask | NestedSubtask)[];
  
  // Fields needed for task management
  snooze_count?: number;
  snoozed_until?: string | null;
  archived_at?: string | null;
  archive_reason?: ArchiveReason | null;
  
  subtasks?: SubTask[];
  
  // Recurring task settings
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
  };
}
