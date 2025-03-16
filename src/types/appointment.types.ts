
// Define explicit interfaces to avoid deep type instantiation
export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  is_all_day: boolean;
  status: "upcoming" | "completed" | "cancelled";
  user_id: string;
  assignee_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type AppointmentTab = "my-appointments" | "shared-appointments" | "assigned-appointments";

export interface AppointmentFormData {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_all_day: boolean;
  status?: "upcoming" | "completed" | "cancelled";
  assignee_id?: string | null;
}

export interface AppointmentsResult {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business";
}
