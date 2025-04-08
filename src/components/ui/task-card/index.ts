
import { TaskCardHeader } from "./TaskCardHeader";
import { TaskCardMenu } from "./TaskCardMenu";
import { TaskCardFooter } from "./TaskCardFooter";
import { TaskDueDate } from "./TaskDueDate";
import { TaskSubtasks } from "./TaskSubtasks";
import { TaskCardCompletionAnimation } from "./TaskCardCompletionAnimation";
import TaskCard from "./TaskCard";

// Re-export all components
export { 
  TaskCardHeader, 
  TaskCardMenu, 
  TaskCardFooter, 
  TaskDueDate,
  TaskSubtasks,
  TaskCardCompletionAnimation,
  TaskCard
};

// Also export TaskCard as default for backwards compatibility
export default TaskCard;
