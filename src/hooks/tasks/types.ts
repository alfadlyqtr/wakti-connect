import { Task, TaskFormData } from "@/types/task.types";

export interface UseTaskOperationsReturn {
  createTask: (taskData: TaskFormData) => Promise<Task>;
  isProcessing: boolean;
}
