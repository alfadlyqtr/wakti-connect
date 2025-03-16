
import * as z from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["urgent", "high", "medium", "normal"]).default("normal"),
  due_date: z.date()
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
