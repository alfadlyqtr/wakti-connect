
import { z } from "zod";

// Define the subtask schema
const SubtaskSchema = z.object({
  content: z.string().min(1, "Subtask content is required"),
  is_completed: z.boolean().default(false),
  due_date: z.string().optional().nullable(),
  due_time: z.string().optional().nullable(),
});

// Define the main form schema
export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().optional().nullable(),
  priority: z.enum(["urgent", "high", "medium", "normal"] as const).default("normal"),
  due_date: z.string().min(1, "Due date is required"),
  due_time: z.string().optional().nullable(),
  
  // Subtasks
  subtasks: z.array(SubtaskSchema).default([]),
});

// Export the TypeScript type
export type TaskFormValues = z.infer<typeof taskFormSchema>;
