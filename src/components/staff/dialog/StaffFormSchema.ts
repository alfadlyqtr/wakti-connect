
import { z } from "zod";

export const staffFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
  role: z.string().min(1, "Please select a role"),
  position: z.string().optional(),
  sendInvitation: z.boolean().optional().default(false)
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
