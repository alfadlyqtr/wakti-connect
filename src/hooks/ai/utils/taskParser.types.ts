
import { TaskPriority, SubTask } from "@/types/task.types";
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

// Adding DeepSeek-specific types to handle the structured output
export interface DeepSeekSubtask {
  title?: string;
  content?: string;
  subtasks?: (DeepSeekSubtask | string)[];
}

export interface DeepSeekParsedTask {
  title: string;
  due_date?: string;
  due_time?: string;
  priority: TaskPriority;
  subtasks: (string | DeepSeekSubtask)[];
  location?: string;
}
