
// Export task operations from their respective modules
export { 
  markTaskComplete, 
  markTaskPending
} from "./operations/taskStatusOperations";

export { 
  deleteTask
} from "./operations/taskDeleteOperations";

export { 
  addSubtask
} from "./operations/subtaskOperations";

export {
  getTaskById,
  getUpcomingTasks
} from "./operations/taskRetrievalOperations";
