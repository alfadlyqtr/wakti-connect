
import { Appointment, AppointmentStatus, UserProfile } from '../types';
import { validateAppointmentStatus } from './statusValidator';

/**
 * Helper function to safely access nested user/assignee properties
 * and handle possible SelectQueryError objects or null values
 */
export const mapUserProfile = (userData: any): UserProfile | null => {
  // Handle case when there's null, undefined, error data, or it's not an object
  if (!userData || typeof userData !== 'object' || userData.error === true) {
    return null;
  }
  
  // Make sure all required properties exist
  if (userData.id === undefined && userData.email === undefined) {
    return null;
  }
  
  return {
    id: String(userData.id || ''),
    email: String(userData.email || ''),
    display_name: userData.display_name || null
  };
};

/**
 * Maps raw database appointment records to properly formatted Appointment objects
 */
export const mapToAppointment = (appt: any): Appointment => {
  return {
    id: appt.id,
    user_id: appt.user_id,
    title: appt.title,
    description: appt.description,
    location: appt.location,
    start_time: appt.start_time,
    end_time: appt.end_time,
    is_all_day: Boolean(appt.is_all_day),
    status: validateAppointmentStatus(appt.status),
    assignee_id: appt.assignee_id,
    created_at: appt.created_at,
    updated_at: appt.updated_at,
    is_recurring_instance: appt.is_recurring_instance,
    parent_recurring_id: appt.parent_recurring_id,
    appointment_type: appt.appointment_type,
    // Handle joined profile data safely
    user: mapUserProfile(appt.user),
    assignee: mapUserProfile(appt.assignee)
  };
};
