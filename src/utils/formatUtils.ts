
/**
 * Formats a date into a readable string format
 */
export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Convert a date and time strings to ISO format
 */
export const formatDateTimeToISO = (date: Date, startTime: string, endTime: string) => {
  const startDateTime = new Date(date);
  const endDateTime = new Date(date);
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  startDateTime.setHours(startHours, startMinutes);
  endDateTime.setHours(endHours, endMinutes);
  
  return {
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString()
  };
};
