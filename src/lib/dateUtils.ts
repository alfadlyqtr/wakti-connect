
/**
 * Get a greeting based on the time of day
 */
export const getTimeBasedGreeting = (name?: string): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

/**
 * Format a date as a relative time (e.g. "5 minutes ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  
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
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  // If it's older than a month, just return the date
  return messageDate.toLocaleDateString();
};
