
// Basic task status and priority types
export type TaskStatus = "pending" | "in-progress" | "completed" | "snoozed" | "archived" | "late";
export type TaskPriority = "urgent" | "high" | "medium" | "normal";
export type TaskTab = "my-tasks" | "archived" | "reminders";
export type ArchiveReason = "deleted" | "canceled" | string;

// Subtask interface
export interface SubTask {
  id: string;
  task_id: string;
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

// Interface for nested subtasks used by AI parsing
export interface NestedSubtask {
  id?: string;
  content: string;
  title?: string;
  is_completed?: boolean;
  subtasks?: NestedSubtask[];
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
  
  // Fields for AI components
  preserveNestedStructure?: boolean;
  originalSubtasks?: SubTask[];
  
  subtasks?: {
    content: string;
    is_completed?: boolean;
    due_date?: string | null;
    due_time?: string | null;
    title?: string;
    parent_id?: string;
    is_group?: boolean;
  }[];
  
  // Recurring task settings
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
  };
}
