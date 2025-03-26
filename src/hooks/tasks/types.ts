
import { Task, TaskStatus, TaskPriority, TaskTab } from '@/types/task.types';

export interface TaskWithSharedInfo extends Task {
  shared_with?: string[];
  shared_by?: string;
  assigned_by?: string;
  assigned_to?: string;
  subtasks?: {
    id: string;
    content: string;
    is_completed: boolean;
    task_id: string;
    due_date?: string | null;
    due_time?: string | null;
  }[];
  delegated_to?: string;
  delegated_email?: string;
}

export interface UseTaskFiltersReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filteredTasks: TaskWithSharedInfo[];
}

export interface UseTaskOperationsReturn {
  createTask: (taskData: any) => Promise<any>;
  updateTask?: (taskId: string, taskData: any) => Promise<any>;
  deleteTask?: (taskId: string) => Promise<void>;
  shareTask?: (taskId: string, userId: string) => Promise<void>;
  assignTask?: (taskId: string, assigneeId: string) => Promise<void>;
  delegateTask?: (taskId: string, userId?: string, email?: string) => Promise<void>;
}

export interface UseTaskQueriesReturn {
  tasks: TaskWithSharedInfo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isStaff: boolean;
}

export type { TaskTab, TaskStatus, TaskPriority };
