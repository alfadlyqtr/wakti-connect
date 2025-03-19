
import { fetchTasks } from "./fetchService";
import { createTask } from "./createService";
import { shareTask, assignTask } from "./sharingService";
import { 
  markTaskComplete, 
  markTaskPending, 
  deleteTask, 
  addSubtask,
  updateSubtaskStatus,
  deleteSubtask,
  getTaskById,
  getUpcomingTasks 
} from "./taskService";

export { 
  fetchTasks,
  createTask,
  shareTask, 
  assignTask,
  markTaskComplete,
  markTaskPending,
  deleteTask,
  addSubtask,
  updateSubtaskStatus,
  deleteSubtask,
  getTaskById,
  getUpcomingTasks
};

export type { Task, TaskTab, TaskFormData, TasksResult, TaskStatus, TaskPriority, SubTask } from "./types";
