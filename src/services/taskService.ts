
// Re-export task service functions from the new location
export { 
  markTaskComplete, 
  markTaskPending, 
  deleteTask, 
  addSubtask,
  getTaskById,
  getUpcomingTasks
} from "./task/taskService";
