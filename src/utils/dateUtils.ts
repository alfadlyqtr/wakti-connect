
/**
 * Format date utility for event display
 */
export const formatDate = (
  dateString: string, 
  format: 'full' | 'date' | 'time' | 'day' = 'full'
): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  // Format options
  const dateOptions: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  };
  
  const dayOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long'
  };
  
  // Format based on requested type
  switch (format) {
    case 'date':
      return date.toLocaleDateString(undefined, dateOptions);
    case 'time':
      return date.toLocaleTimeString(undefined, timeOptions);
    case 'day':
      return date.toLocaleDateString(undefined, dayOptions);
    case 'full':
    default:
      return `${date.toLocaleDateString(undefined, dateOptions)} at ${date.toLocaleTimeString(undefined, timeOptions)}`;
  }
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Get relative date description (Today, Tomorrow, Yesterday, or formatted date)
 */
export const getRelativeDateLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (isToday(date)) {
    return 'Today';
  } else if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  ) {
    return 'Tomorrow';
  } else if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  } else {
    return formatDate(dateString, 'date');
  }
};
