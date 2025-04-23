
import { TaskPriority, SubTask, NestedSubtask } from "@/types/task.types";

export interface ParsedTaskInfo {
  title: string;
  description?: string;
  priority: TaskPriority;
  subtasks: (SubTask | NestedSubtask | string)[];  // Add string type to support both types
  due_date?: string | Date | null;
  dueTime?: string | null;
  location?: string | null;
  hasTimeConstraint?: boolean;
  needsReview?: boolean;
}
