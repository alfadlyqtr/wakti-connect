
// Define explicit interfaces to avoid deep type instantiation
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in-progress" | "completed" | "late";
  priority: "urgent" | "high" | "medium" | "normal";
  due_date: string | null;
  user_id: string;
  assignee_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskTab = "my-tasks" | "shared-tasks" | "assigned-tasks";

export interface TaskFormData {
  title: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed" | "late";
  priority?: "urgent" | "high" | "medium" | "normal";
  due_date?: string;
  assignee_id?: string | null;
}

export interface TasksResult {
  tasks: Task[];
  userRole: "free" | "individual" | "business";
}
