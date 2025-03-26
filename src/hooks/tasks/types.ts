
import { Task, TaskStatus, TaskPriority, TaskTab } from '@/types/task.types';

// Re-export types that should be available from this module
export type { TaskPriority, TaskStatus, TaskTab } from '@/types/task.types';
export type TaskCategory = "daily" | "weekly" | "monthly" | "quarterly";

export interface TaskWithSharedInfo extends Task {
  shared_with?: string[];
  shared_by?: string;
  assigned_by?: string;
  assigned_to?: string;
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

export interface UseTaskQueriesReturn {
  tasks: TaskWithSharedInfo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isStaff: boolean;
}

export interface UseTaskOperationsReturn {
  createTask: (taskData: any) => Promise<Task>;
}
