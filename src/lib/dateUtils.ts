
/**
 * Returns a time-based greeting based on the current hour
 */
export const getTimeBasedGreeting = (userName?: string): string => {
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  
  return userName ? `${greeting}, ${userName}!` : `${greeting}!`;
};

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Format a time to a readable string
 */
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { 
    hour: 'numeric', 
    minute: 'numeric',
    hour12: true
  }).format(date);
};

/**
 * Get the day name for a date
 */
export const getDayName = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
};
