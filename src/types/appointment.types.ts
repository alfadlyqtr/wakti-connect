
// The appointment system has been deprecated
// These types are kept as placeholders to prevent import errors

export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status: AppointmentStatus;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
  is_recurring_instance?: boolean;
  parent_recurring_id?: string | null;
  appointment_type?: string;
}

export type AppointmentStatus = "scheduled" | "cancelled" | "completed";

export type AppointmentTab = "my-appointments" | "shared-appointments" | "assigned-appointments" | "team-appointments" | "upcoming" | "past" | "invitations";

export interface AppointmentFormData {
  title: string;
  description?: string;
  location?: string;
  status?: AppointmentStatus;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
  appointment_type?: string;
}

export interface AppointmentsResult {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business";
}

export interface MonthlyUsage {
  appointments_created: number;
  events_created: number;
  month: number;
  year: number;
}
