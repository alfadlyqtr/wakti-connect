
import { 
  Appointment, 
  AppointmentFormData, 
  AppointmentStatus, 
  AppointmentType 
} from '@/types/appointment.types';

// Re-export appointment types
export type { 
  Appointment, 
  AppointmentFormData, 
  AppointmentStatus, 
  AppointmentType 
};

export interface AppointmentResponse {
  data: Appointment[];
  error: any;
}

export interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
}
