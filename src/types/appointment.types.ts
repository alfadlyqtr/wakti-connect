
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
  created_at: string;
  updated_at: string;
}

export type AppointmentStatus = "scheduled" | "cancelled" | "completed";

// Update AppointmentTab to match the expected values used in the components
export type AppointmentTab = "my-appointments" | "shared-appointments" | "assigned-appointments" | "upcoming" | "past" | "invitations";

export interface AppointmentFormData {
  title: string;
  description?: string;
  location?: string;
  status?: AppointmentStatus;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
  invitees?: string[];
  
  // Form-specific fields (used in form UI but transformed before API calls)
  date?: Date;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
}

export interface AppointmentsResult {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business";
}
