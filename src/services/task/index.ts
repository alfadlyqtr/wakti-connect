
// Re-export all task service functions
export { fetchTasks } from "./fetchService";
export { createTask } from "./createService";
export { shareTask } from "./sharingService";
export type { Task, TaskTab, TaskFormData, TaskStatus, TaskPriority } from "../types";
