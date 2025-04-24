
import { z } from "zod";

export const StaffFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  position: z.string().optional(),
  isCoAdmin: z.boolean().optional().default(false),
  isServiceProvider: z.boolean().optional().default(false),
  permissions: z.object({
    can_manage_tasks: z.boolean().optional().default(false),
    can_manage_bookings: z.boolean().optional().default(false),
    can_track_hours: z.boolean().optional().default(true),
    can_log_earnings: z.boolean().optional().default(false),
    can_view_analytics: z.boolean().optional().default(false),
    can_view_tasks: z.boolean().optional().default(true),
    can_update_task_status: z.boolean().optional().default(false),
    can_view_customer_bookings: z.boolean().optional().default(false),
    can_update_booking_status: z.boolean().optional().default(false),
    can_create_job_cards: z.boolean().optional().default(false),
    can_message_staff: z.boolean().optional().default(true),
    can_edit_profile: z.boolean().optional().default(true),
    can_update_profile: z.boolean().optional().default(false)
  }),
  avatar: z.any().optional(),
  addToContacts: z.boolean().optional().default(true)
});

export type StaffFormValues = z.infer<typeof StaffFormSchema>;
