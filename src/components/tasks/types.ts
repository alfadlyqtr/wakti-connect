
// Define task filters as string-based types to avoid type errors
export type TaskStatusFilter = "all" | "pending" | "in-progress" | "completed" | "late" | "snoozed";
export type TaskPriorityFilter = "all" | "urgent" | "high" | "medium" | "normal";
