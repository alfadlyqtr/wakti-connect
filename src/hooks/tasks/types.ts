
import { Task, TaskTab } from "@/types/task.types";

export interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  filterPriority: string | null;
  setFilterPriority: (priority: string | null) => void;
  createTask: (taskData: any) => Promise<Task>;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isStaff: boolean;
  refetch: () => void;
}

export interface UseTaskOperationsReturn {
  createTask: (taskData: any) => Promise<Task>;
  delegateTask: (taskId: string, userId?: string, email?: string) => Promise<void>;
  isProcessing: boolean;
}

// Add the missing types for TaskWithSharedInfo and UseTaskQueriesReturn
export interface TaskWithSharedInfo extends Task {
  is_shared?: boolean;
  shared_by?: string;
  shared_by_name?: string;
  original_owner_id?: string;
}

export interface UseTaskQueriesReturn {
  tasks: TaskWithSharedInfo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isStaff: boolean;
}

export interface UseTaskFiltersReturn {
  filteredTasks: TaskWithSharedInfo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  filterPriority: string | null;
  setFilterPriority: (priority: string | null) => void;
}

// Export TaskTab from types.ts to fix import issue
export { TaskTab };
