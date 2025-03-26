
import { z } from "zod";
import { TaskPriority, TaskStatus } from "@/types/task.types";

// Define the recurring settings schema
const RecurringSettingsSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly"]).default("weekly"),
  interval: z.number().min(1).max(30).default(1),
  // Optional fields for more complex recurrence patterns
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  endDate: z.string().optional(),
  maxOccurrences: z.number().optional(),
});

// Define the subtask schema including due date and time
const SubtaskSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, "Subtask content is required"),
  isCompleted: z.boolean().default(false),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
});

// Define the main form schema
export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed", "late", "snoozed"] as const).default("pending"),
  priority: z.enum(["urgent", "high", "medium", "normal"] as const).default("normal"),
  dueDate: z.string().min(1, "Due date is required"),
  dueTime: z.string().optional(),
  assigneeId: z.string().optional(),
  
  // Recurring task settings
  isRecurring: z.boolean().default(false),
  recurring: RecurringSettingsSchema.optional(),
  
  // Subtasks
  enableSubtasks: z.boolean().default(false),
  subtasks: z.array(SubtaskSchema).default([]),
  
  // Task delegation (for business accounts)
  delegated_to: z.string().optional(),
  delegated_email: z.string().email().optional(),
  
  // Team task flag (for business accounts)
  is_team_task: z.boolean().default(false),
});

// Export the TypeScript type
export type TaskFormValues = z.infer<typeof taskFormSchema>;
