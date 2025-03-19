
// Re-export all task service functions
export { fetchTasks } from "./fetchService";
export { createTask } from "./createService";
export { shareTask, assignTask } from "./sharingService";
export type { Task, TaskTab, TaskFormData, TasksResult, TaskStatus, TaskPriority } from "./types";
