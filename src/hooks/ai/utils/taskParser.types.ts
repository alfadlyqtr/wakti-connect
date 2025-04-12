
import { TaskPriority, SubTask } from "@/types/task.types";

export interface ParsedTaskInfo {
  title: string;
  description: string;
  priority: TaskPriority;
  subtasks: string[];
  due_date?: string;
  due_time?: string;
  location?: string;
  hasTimeConstraint?: boolean;
  needsReview?: boolean;
}
