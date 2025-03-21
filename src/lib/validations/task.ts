
import * as z from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["urgent", "high", "medium", "normal"]).default("normal"),
  due_date: z.string(), // ISO string format for the date
  status: z.enum(["pending", "in-progress", "completed", "late"]).default("pending"),
  category: z.enum(["daily", "weekly", "monthly", "quarterly"]).default("daily"),
  recurring: z.object({
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
    interval: z.number().optional(),
    days_of_week: z.string().optional(),
    day_of_month: z.number().optional(),
    max_occurrences: z.number().optional()
  }).optional()
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
