
// Re-export task service functions from the new location
export { 
  markTaskComplete, 
  markTaskPending, 
  deleteTask, 
  addSubtask,
  updateSubtaskStatus,
  deleteSubtask,
  getTaskById,
  getUpcomingTasks
} from "./task/taskService";
