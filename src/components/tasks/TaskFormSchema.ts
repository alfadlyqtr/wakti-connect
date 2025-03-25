
import * as z from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["urgent", "high", "medium", "normal"]).default("normal"),
  due_date: z.string(),
  subtasks: z.array(
    z.object({
      content: z.string().min(1, "Subtask content is required"),
      is_completed: z.boolean().default(false)
    })
  ).default([]),
  isRecurring: z.boolean().optional(),
  recurring: z.object({
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
    interval: z.number().optional(),
    days_of_week: z.array(z.string()).optional(),
    day_of_month: z.number().optional(),
    end_date: z.date().optional().nullable(),
    max_occurrences: z.number().optional()
  }).optional()
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
