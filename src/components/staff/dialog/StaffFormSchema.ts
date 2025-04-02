
import { z } from "zod";

export const StaffFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email address").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  isCoAdmin: z.boolean().default(false),
  isServiceProvider: z.boolean().default(false),
  permissions: z.object({
    can_manage_tasks: z.boolean().default(false),
    can_manage_bookings: z.boolean().default(false),
    can_track_hours: z.boolean().default(true),
    can_log_earnings: z.boolean().default(false),
    can_view_analytics: z.boolean().default(false),
    can_view_tasks: z.boolean().default(true),
    can_update_task_status: z.boolean().default(false),
    can_view_customer_bookings: z.boolean().default(false),
    can_update_booking_status: z.boolean().default(false),
    can_create_job_cards: z.boolean().default(false),
    can_message_staff: z.boolean().default(true),
    can_edit_profile: z.boolean().default(true),
    can_update_profile: z.boolean().default(false)
  }).default({
    can_manage_tasks: false,
    can_manage_bookings: false,
    can_track_hours: true,
    can_log_earnings: false,
    can_view_analytics: false,
    can_view_tasks: true,
    can_update_task_status: false,
    can_view_customer_bookings: false,
    can_update_booking_status: false,
    can_create_job_cards: false,
    can_message_staff: true,
    can_edit_profile: true,
    can_update_profile: false
  }),
  avatar: z.any().optional(),
  addToContacts: z.boolean().default(true)
}).refine(data => !data.password || data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type StaffFormValues = z.infer<typeof StaffFormSchema>;
