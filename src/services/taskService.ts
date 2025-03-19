
// Re-export task service functions from the new location
export { 
  markTaskComplete, 
  markTaskPending, 
  deleteTask, 
  addSubtask,
  getTaskById
} from "./task/taskService";
