
import { z } from "zod";

export const staffFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  position: z.string().optional(),
  isServiceProvider: z.boolean().default(false),
  isCoAdmin: z.boolean().default(false),
  permissions: z.object({
    can_manage_tasks: z.boolean().default(false),
    can_manage_bookings: z.boolean().default(false),
    can_track_hours: z.boolean().default(true),
    can_log_earnings: z.boolean().default(false),
    can_view_analytics: z.boolean().default(false)
  }).default({
    can_manage_tasks: false,
    can_manage_bookings: false,
    can_track_hours: true,
    can_log_earnings: false,
    can_view_analytics: false
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
