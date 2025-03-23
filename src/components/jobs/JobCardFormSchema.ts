
import * as z from "zod";

export const jobCardFormSchema = z.object({
  job_id: z.string().min(1, "Job selection is required"),
  payment_method: z.enum(["cash", "pos", "none"], {
    required_error: "Payment method is required"
  }),
  payment_amount: z.coerce.number().min(0),
  notes: z.string().optional()
});

export type JobCardFormValues = z.infer<typeof jobCardFormSchema>;
