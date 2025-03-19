
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

/**
 * Filter sessions by date range
 */
export const filterSessionsByDateRange = (
  sessions: Array<{ start_time: string }>, 
  startDate?: Date, 
  endDate?: Date
) => {
  if (!startDate && !endDate) return sessions;

  return sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    
    const isAfterStartDate = !startDate || sessionDate >= startDate;
    
    // Set end date to end of day for proper comparison
    const endOfDay = endDate 
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) 
      : undefined;
    const isBeforeEndDate = !endDate || sessionDate <= endOfDay;
    
    return isAfterStartDate && isBeforeEndDate;
  });
};
