
import { Task, TaskFormData, TaskStatus, TaskPriority, SubTask } from "@/types/task.types";

export interface UseTaskOperationsReturn {
  createTask: (taskData: TaskFormData) => Promise<Task>;
  isProcessing: boolean;
}

export interface TaskWithSharedInfo extends Task {
  is_shared?: boolean;
  original_owner_id?: string;
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

export interface UseTaskQueriesReturn {
  tasks: TaskWithSharedInfo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isStaff: boolean;
}

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
  createTask: (taskData: TaskFormData) => Promise<Task>;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isStaff: boolean;
  refetch: () => Promise<void>;
}

// Export the TaskTab type correctly with export type
export type { TaskTab } from "@/types/task.types";
