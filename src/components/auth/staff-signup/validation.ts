
import { z } from "zod";

// Form validation schema for creating staff accounts
export const staffSignupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  position: z.string().optional(),
  isServiceProvider: z.boolean().default(false),
  isCoAdmin: z.boolean().default(false),
  permissions: z.object({
    can_view_tasks: z.boolean().default(true),
    can_manage_tasks: z.boolean().default(false),
    can_message_staff: z.boolean().default(true),
    can_manage_bookings: z.boolean().default(false),
    can_create_job_cards: z.boolean().default(false),
    can_track_hours: z.boolean().default(true),
    can_log_earnings: z.boolean().default(false),
    can_edit_profile: z.boolean().default(true),
    can_view_customer_bookings: z.boolean().default(false),
    can_view_analytics: z.boolean().default(false)
  }).default({
    can_view_tasks: true,
    can_manage_tasks: false,
    can_message_staff: true,
    can_manage_bookings: false,
    can_create_job_cards: false,
    can_track_hours: true,
    can_log_earnings: false,
    can_edit_profile: true,
    can_view_customer_bookings: false,
    can_view_analytics: false
  })
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type StaffFormValues = z.infer<typeof staffSignupSchema>;
