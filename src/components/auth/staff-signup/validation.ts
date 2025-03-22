
import { z } from "zod";

// Form validation schema for creating staff accounts
export const staffSignupSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type StaffFormValues = z.infer<typeof staffSignupSchema>;
export type StaffSignupFormValues = StaffFormValues;
