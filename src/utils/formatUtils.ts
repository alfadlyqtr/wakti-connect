
/**
 * Format a currency amount
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Format a date string
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a time string
 */
export const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return '';
  
  return new Date(timeString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a duration - function overloads
 */
export function formatDuration(minutes: number): string;
export function formatDuration(start: Date, end: Date): string;

export function formatDuration(arg1: number | Date, arg2?: Date): string {
  // If arg1 is a number and arg2 is undefined, format minutes
  if (typeof arg1 === 'number' && arg2 === undefined) {
    const minutes = arg1;
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }
  
  // If both args are Dates, calculate duration between them
  if (arg1 instanceof Date && arg2 instanceof Date) {
    const diffMs = arg2.getTime() - arg1.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return formatDuration(diffMins);
  }
  
  // Default fallback
  return "Invalid duration";
}

/**
 * Format a date and time string
 */
export const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
