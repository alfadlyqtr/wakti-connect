
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine classNames with Tailwind's class conflict resolution
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date as a relative time (e.g. "5 minutes ago")
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "just now";
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  return date.toLocaleDateString();
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
