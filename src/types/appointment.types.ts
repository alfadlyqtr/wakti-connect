
import { RecurringInstance } from './recurring.types';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'draft';
export type AppointmentType = 'appointment' | 'meeting' | 'event' | 'reminder';

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status: AppointmentStatus;
  appointment_type: AppointmentType; // Required field
  user_id: string;
  assignee_id?: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    display_name: string;
  };
}

export interface RecurringAppointment extends Appointment, RecurringInstance {}

export interface AppointmentFormData {
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status?: AppointmentStatus;
  appointment_type: AppointmentType; // Required field
  assignee_id?: string | null;
}
