
import { Task, TaskFormData, TaskStatus, TaskPriority, SubTask } from "@/types/task.types";
import { UserRole } from "@/types/user";

export interface UseTaskOperationsReturn {
  createTask: (taskData: TaskFormData) => Promise<Task>;
  updateTask: (taskId: string, taskData: Partial<TaskFormData>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<Task>;
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

export type TaskTab = "my-tasks" | "shared" | "assigned" | "team" | "archived" | "reminders";

export interface UseTaskQueriesReturn {
  tasks: TaskWithSharedInfo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  userRole: UserRole | null;
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
  setPriorityFilter: (priority: string | null) => void;
  userRole: UserRole | null;
  isStaff: boolean;
  refetch: () => Promise<void>;
}
