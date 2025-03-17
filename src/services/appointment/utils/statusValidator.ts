
import { AppointmentStatus } from "../types";

/**
 * Validates and normalizes the appointment status to ensure it matches
 * the allowed values in the AppointmentStatus type
 */
export const validateAppointmentStatus = (status: string): AppointmentStatus => {
  const validStatuses: AppointmentStatus[] = ["scheduled", "cancelled", "completed"];
  
  if (validStatuses.includes(status as AppointmentStatus)) {
    return status as AppointmentStatus;
  }
  
  // Default to "scheduled" if an invalid status is provided
  console.warn(`Invalid appointment status: ${status}, defaulting to "scheduled"`);
  return "scheduled";
};
