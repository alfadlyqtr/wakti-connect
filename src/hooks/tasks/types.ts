
import { Task } from "@/types/task.types";

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
