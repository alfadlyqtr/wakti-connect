
import * as z from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["urgent", "high", "medium", "normal"]).default("normal"),
  due_date: z.string(), // Keep as string for form handling
  due_time: z.string().optional(), // Add due time field
  subtasks: z.array(
    z.object({
      content: z.string().min(1, "Subtask content is required"),
      is_completed: z.boolean().default(false),
      due_date: z.string().optional().nullable(),
      due_time: z.string().optional().nullable()
    })
  ).default([]),
  isRecurring: z.boolean().optional(),
  enableSubtasks: z.boolean().default(false), // Add toggle for subtasks
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
