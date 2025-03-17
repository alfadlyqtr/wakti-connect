
import { AppointmentStatus } from "../types";

/**
 * Validates appointment status, returning a default if invalid
 */
export const validateAppointmentStatus = (status: string): AppointmentStatus => {
  const validStatuses: AppointmentStatus[] = ['scheduled', 'confirmed', 'cancelled', 'completed', 'draft'];
  
  if (validStatuses.includes(status as AppointmentStatus)) {
    return status as AppointmentStatus;
  }
  
  return 'scheduled';
};
