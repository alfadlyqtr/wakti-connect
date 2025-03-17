
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
  invitations?: AppointmentInvitation[];
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

export interface AppointmentInvitation {
  id: string;
  appointment_id: string;
  invited_user_id?: string;
  email?: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  shared_as_link: boolean;
  customization?: any;
}
