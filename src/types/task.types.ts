
// Define task types for consistent use
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'late';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'normal';
export type TaskTab = 'daily' | 'weekly' | 'monthly' | 'quarterly';

// Core task types
export interface SubTask {
  id: string;
  task_id: string;
  content: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  user_id: string;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
  is_recurring_instance?: boolean;
  parent_recurring_id?: string | null;
  subtasks?: SubTask[];
}

// Task form data for create/edit
export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date | null;
  assignee_id?: string | null;
  recurrence?: {
    frequency: string;
    interval: number;
    endDate?: Date;
    maxOccurrences?: number;
  } | null;
}

// Result type for task queries
export interface TasksResult {
  data: Task[] | null;
  error: Error | null;
  isLoading: boolean;
}
