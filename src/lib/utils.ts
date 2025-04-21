
// Import parseISO for safe ISO string parsing
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parseISO, isValid as isValidDate } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a timestamp to a relative time string (e.g. "2 minutes ago")
 * with improved accuracy for recent timestamps and proper date parsing
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();

  // Convert string to Date safely and validate
  const timestamp = (typeof date === 'string') ? parseISO(date) : date;

  // Handle invalid dates
  if (!isValidDate(timestamp)) {
    return 'Invalid date';
  }

  const milliseconds = now.getTime() - timestamp.getTime();
  const seconds = Math.floor(milliseconds / 1000);

  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }

  // Minutes
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  // Hours
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  // Days
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  // Format as regular date for older timestamps
  return timestamp.toLocaleDateString();
}
