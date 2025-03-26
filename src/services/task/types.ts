
import { Task, TaskFormData, TaskStatus, TaskPriority, SubTask, TaskTab } from "@/types/task.types";

export interface TaskWithSharedInfo extends Task {
  is_shared?: boolean;
  original_owner_id?: string;
}

export type { Task, TaskFormData, TaskStatus, TaskPriority, SubTask, TaskTab };
