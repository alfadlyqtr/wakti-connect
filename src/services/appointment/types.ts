
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
  
  // Define proper interfaces for joined data
  user?: UserProfile | null;
  assignee?: UserProfile | null;
}

// Define interface for user/assignee data
export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
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
  invitees?: string[];
  assignee_id?: string | null;
  appointment_type?: string;
}

export interface AppointmentsResult {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business";
  monthlyUsage?: MonthlyUsage;
}

export interface MonthlyUsage {
  appointments_created: number;
  events_created: number;
  month: number;
  year: number;
}
