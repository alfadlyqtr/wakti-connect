
import { Task, TaskFormData, TaskStatus, TaskPriority, SubTask } from "@/types/task.types";

export interface TaskWithSharedInfo extends Task {
  is_shared?: boolean;
  original_owner_id?: string;
}

export interface TasksResult {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | "staff";
}

export type TaskTab = "my-tasks";

export type { Task, TaskFormData, TaskStatus, TaskPriority, SubTask };
