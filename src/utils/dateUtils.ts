
import { format } from "date-fns";

/**
 * Format a date string to readable date format
 */
export const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d, yyyy');
};

/**
 * Format a time string to readable time format
 */
export const formatTime = (dateTime: string | Date | null) => {
  if (!dateTime) return "—";
  const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  return format(dateObj, 'h:mm a');
};

/**
 * Calculate hours between start and end times
 */
export const calculateHours = (startTime: string, endTime: string | null) => {
  if (!endTime) return "—";
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return diffHours.toFixed(1);
};
