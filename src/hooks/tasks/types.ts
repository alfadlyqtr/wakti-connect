
import { Task, TaskPriority, TaskStatus, TaskTab } from "@/types/task.types";

// Extended Task interface with shared info
export interface TaskWithSharedInfo extends Task {
  shared_with?: string[];
}

// Return type for useTaskQueries hook
export interface UseTaskQueriesReturn {
  tasks: TaskWithSharedInfo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isStaff: boolean;
}

// Return type for useTaskOperations hook
export interface UseTaskOperationsReturn {
  createTask: (taskData: any) => Promise<any>;
  delegateTask: (taskId: string, userId?: string, email?: string) => Promise<void>;
}

// Return type for useTaskFilters hook
export interface UseTaskFiltersReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filteredTasks: TaskWithSharedInfo[];
}

// Re-export TaskTab from task.types to prevent circular dependencies
export type { TaskTab };
