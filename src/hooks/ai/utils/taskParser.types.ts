
import { TaskPriority } from "@/types/task.types";
import { NestedSubtask } from "@/services/ai/aiTaskParserService";

export interface ParsedTaskInfo {
  title: string;
  description?: string;
  priority: TaskPriority;
  subtasks: (string | NestedSubtask)[];  // Explicitly support nested subtasks
  due_date?: string | Date | null;
  dueTime?: string | null;
  location?: string | null;
  hasTimeConstraint?: boolean;
  needsReview?: boolean;
}
