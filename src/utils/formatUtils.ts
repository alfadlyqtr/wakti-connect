
/**
 * Format a date and time strings to ISO format for database storage
 */
export const formatDateTimeToISO = (
  date: Date, 
  startTime: string, 
  endTime?: string
): { start_time: string; end_time?: string } => {
  // Parse the start time
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  
  // Create a new date object for start time
  const startDate = new Date(date);
  startDate.setHours(startHours, startMinutes, 0, 0);
  
  // Format result
  const result: { start_time: string; end_time?: string } = {
    start_time: startDate.toISOString()
  };
  
  // If end time is provided, parse it too
  if (endTime) {
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    // Create a new date object for end time
    const endDate = new Date(date);
    endDate.setHours(endHours, endMinutes, 0, 0);
    
    result.end_time = endDate.toISOString();
  }
  
  return result;
};

/**
 * Format a money amount to display as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date to a readable string
 */
export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a time to a readable string
 */
export const formatTimeString = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
