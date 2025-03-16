
/**
 * Calculate total hours for a work session
 */
export const calculateHours = (startTime: string, endTime: string | null) => {
  if (!endTime) return "In progress";
  
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const hours = (end - start) / (1000 * 60 * 60);
  
  return hours.toFixed(2);
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format time to readable format
 */
export const formatTime = (timeString: string | null) => {
  if (!timeString) return "—";
  
  const time = new Date(timeString);
  return time.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};
