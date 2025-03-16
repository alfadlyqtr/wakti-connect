
import * as z from "zod";

export const jobFormSchema = z.object({
  name: z.string().min(1, "Job name is required"),
  description: z.string().optional(),
  duration: z.coerce.number().positive().optional(),
  default_price: z.coerce.number().min(0).optional()
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
