
import { z } from "zod";

// Define the subtask schema
const SubtaskSchema = z.object({
  content: z.string().min(1, "Subtask content is required"),
  is_completed: z.boolean().default(false),
  due_date: z.string().optional().nullable(),
  due_time: z.string().optional().nullable(),
  title: z.string().optional(),
  parent_id: z.string().optional(),
  is_group: z.boolean().optional(),
});

// Define the recurring settings schema - making fields required
const RecurringSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly"]),
  interval: z.number().int().positive()
});

// Define the main form schema
export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().optional().nullable(),
  priority: z.enum(["urgent", "high", "medium", "normal"] as const).default("normal"),
  due_date: z.string().min(1, "Due date is required"),
  due_time: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  status: z.enum(["pending", "in-progress", "completed", "snoozed", "archived", "late"] as const).optional(),
  
  // Fields that will be managed through the form's context
  enableSubtasks: z.boolean().optional().default(false),
  isRecurring: z.boolean().optional().default(false),
  
  // Subtasks
  subtasks: z.array(SubtaskSchema).default([]),
  
  // Recurring task settings - now optional at the top level
  recurring: RecurringSchema.optional(),
  
  // Fields for AI components
  preserveNestedStructure: z.boolean().optional(),
  originalSubtasks: z.array(z.any()).optional(),
});

// Export the TypeScript type
export type TaskFormValues = z.infer<typeof taskFormSchema>;
