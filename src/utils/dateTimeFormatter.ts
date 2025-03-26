
import { format, parseISO, isValid } from 'date-fns';

/**
 * Formats a time string from 24-hour format to 12-hour format
 * @param time Time string in HH:MM format
 * @returns Formatted time in 12-hour format with AM/PM
 */
export function formatTimeString(time: string | null | undefined): string | null {
  if (!time) return null;
  
  // Split the time by colon to get hours and minutes
  const [hours, minutes] = time.split(':');
  
  if (!hours || !minutes) return null;
  
  // Convert to 12-hour format
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Formats a date string to a readable format
 * @param dateString ISO date string
 * @param formatStr Date format string (defaults to 'MMM d, yyyy')
 * @returns Formatted date string
 */
export function formatDateString(dateString: string | null | undefined, formatStr = 'MMM d, yyyy'): string | null {
  if (!dateString) return null;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return null;
    return format(date, formatStr);
  } catch (error) {
    return null;
  }
}

/**
 * Combines date and time into a readable format
 * @param dateString ISO date string
 * @param timeString Time string in HH:MM format
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string | null | undefined, timeString: string | null | undefined): string | null {
  const formattedDate = formatDateString(dateString);
  const formattedTime = formatTimeString(timeString);
  
  if (!formattedDate) return null;
  if (!formattedTime) return formattedDate;
  
  return `${formattedDate} at ${formattedTime}`;
}
