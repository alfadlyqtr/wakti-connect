
import * as z from "zod";

export const appointmentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAllDay: z.boolean().default(false),
  // Adding the recurring fields to the schema
  isRecurring: z.boolean().optional(),
  recurring: z.object({
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
    interval: z.number().optional(),
    days_of_week: z.array(z.string()).optional(),
    day_of_month: z.number().optional(),
    end_date: z.date().optional().nullable(),
    max_occurrences: z.number().optional()
  }).optional()
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export const getDefaultFormValues = (): AppointmentFormValues => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Setting default times (9 AM to 10 AM)
  const defaultStartTime = "09:00";
  const defaultEndTime = "10:00";
  
  return {
    title: "",
    description: "",
    location: "",
    date: tomorrow,
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    isAllDay: false
  };
};
