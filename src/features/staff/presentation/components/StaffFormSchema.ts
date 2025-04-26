
import { z } from "zod";
import { StaffFormValues } from "../../domain/types";

export const StaffFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  position: z.string().optional(),
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
  }).default({}),
  avatar: z.instanceof(File).optional().nullable(),
  addToContacts: z.boolean().default(true)
}).refine(
  data => !data.password || data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }
);

export type { StaffFormValues };
