
import { AppointmentStatus } from "../types";

/**
 * Validates and normalizes appointment status values
 * @param status Any potential status value
 * @returns Valid AppointmentStatus or "scheduled" as default
 */
export function validateAppointmentStatus(status: any): AppointmentStatus {
  const validStatuses: AppointmentStatus[] = ["scheduled", "cancelled", "completed"];
  
  if (status && validStatuses.includes(status as AppointmentStatus)) {
    return status as AppointmentStatus;
  }
  
  // Default to "scheduled" if status is invalid
  return "scheduled";
}
