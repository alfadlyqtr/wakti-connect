
import { Task, TaskFormData, TaskStatus, TaskPriority, SubTask } from "@/types/task.types";
import { UserRole } from "@/types/user";

export interface TaskWithSharedInfo extends Task {
  is_shared?: boolean;
  original_owner_id?: string;
}

export interface TasksResult {
  tasks: Task[];
  userRole: UserRole;
}

// Now that we've simplified the TaskTab to only support "my-tasks",
// this ensures consistency in our services
export type TaskTab = "my-tasks";

export type { Task, TaskFormData, TaskStatus, TaskPriority, SubTask };
