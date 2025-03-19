
// Import and re-export task services
import { fetchTasksByTab } from "./fetchService";
import { createTaskWithSubtasks } from "./createService";
import { shareTask, assignTask } from "./sharingService";
import { 
  markTaskComplete, 
  markTaskPending,
  updateTaskStatus
} from "./operations/taskStatusOperations";
import { deleteTask } from "./operations/taskDeleteOperations";
import { 
  addSubtask,
  updateSubtaskStatus,
  deleteSubtask
} from "./taskService";
import { 
  getTaskById,
  getUpcomingTasks 
} from "./operations/taskRetrievalOperations";

// Export everything with appropriate names
export { 
  fetchTasksByTab as fetchTasks,
  createTaskWithSubtasks as createTask,
  shareTask, 
  assignTask,
  markTaskComplete,
  markTaskPending,
  updateTaskStatus,
  deleteTask,
  addSubtask,
  updateSubtaskStatus,
  deleteSubtask,
  getTaskById,
  getUpcomingTasks
};

// Export types from a centralized location
export type { 
  Task, 
  TaskTab, 
  TaskFormData, 
  TasksResult, 
  TaskStatus, 
  TaskPriority, 
  SubTask 
} from "@/types/task.types";
