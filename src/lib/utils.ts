
// Import parseISO for safe ISO string parsing
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parseISO, isValid, format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a timestamp to a relative time string (e.g. "2 minutes ago")
 * with improved accuracy for recent timestamps and proper date parsing
 */
export function formatRelativeTime(date: Date | string): string {
  try {
    // Convert string to Date safely and validate
    const timestamp = (typeof date === 'string') ? parseISO(date) : date;
    
    // Handle invalid dates
    if (!isValid(timestamp)) {
      console.warn('Invalid date passed to formatRelativeTime:', date);
      return 'Invalid date';
    }
    
    // Debug information
    console.log('Formatting date:', timestamp, 'Original input:', date);
    
    // Use formatDistanceToNow for more accurate time distances
    return formatDistanceToNow(timestamp, { addSuffix: true });
  } catch (error) {
    console.error('Error in formatRelativeTime:', error, 'for date:', date);
    return 'Unknown date';
  }
}
