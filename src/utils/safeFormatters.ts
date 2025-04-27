
import { format, formatDistanceToNow, isValid } from "date-fns";

/**
 * Safely formats a date to a relative time string (e.g., "2 hours ago")
 * Handles invalid dates gracefully by returning a fallback value
 */
export const safeFormatDistanceToNow = (
  dateString: string | Date | null | undefined,
  fallback: string = "Recently"
): string => {
  if (!dateString) return fallback;
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // Check if the date is valid
    if (!isValid(date)) {
      console.warn("Invalid date encountered:", dateString);
      return fallback;
    }
    
    // Check if the date is unreasonably far in the past or future (likely a data error)
    const now = new Date();
    const yearDifference = Math.abs(now.getFullYear() - date.getFullYear());
    if (yearDifference > 100) {
      console.warn("Suspicious date (too far from current date):", dateString);
      return fallback;
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    console.error("Error formatting relative date:", e, "for input:", dateString);
    return fallback;
  }
};

/**
 * Safely formats a date string to a date display format
 * Handles invalid dates gracefully by returning a fallback value
 */
export const safeFormatDate = (
  dateString: string | Date | null | undefined,
  formatStr: string = "MMM d, yyyy",
  fallback: string = "Unknown date"
): string => {
  if (!dateString) return fallback;
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (!isValid(date)) {
      console.warn("Invalid date encountered:", dateString);
      return fallback;
    }
    
    return format(date, formatStr);
  } catch (e) {
    console.error("Error formatting date:", e, "for input:", dateString);
    return fallback;
  }
};
