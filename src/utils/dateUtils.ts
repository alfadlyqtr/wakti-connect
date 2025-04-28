
import { format, formatDistanceToNow, isValid } from "date-fns";

/**
 * Format a time string to display time in a readable format
 */
export const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    console.error("Error formatting time:", e);
    return "Invalid date";
  }
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString();
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid date";
  }
};

/**
 * Format a date string to a shorter readable format
 */
export const formatDateShort = (date: Date): string => {
  try {
    if (!isValid(date)) return "Invalid date";
    return format(date, "MMM d, yyyy");
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid date";
  }
};

/**
 * Format a time range between two dates
 */
export const formatTimeRange = (startDate: Date, endDate: Date): string => {
  try {
    if (!isValid(startDate) || !isValid(endDate)) return "Invalid time range";
    const startTime = format(startDate, "h:mm a");
    const endTime = format(endDate, "h:mm a");
    return `${startTime} - ${endTime}`;
  } catch (e) {
    console.error("Error formatting time range:", e);
    return "Invalid time range";
  }
};

/**
 * Format a date/time string to a readable format with both date and time
 */
export const formatDateTime = (isoString: string): string => {
  try {
    if (!isoString) return "No date";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid date";
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  } catch (e) {
    console.error("Error formatting datetime:", e, "for string:", isoString);
    return "Invalid date";
  }
};
