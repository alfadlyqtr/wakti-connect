
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

/**
 * Format duration between two dates in human-readable format
 */
export const formatDuration = (startDate: Date, endDate: Date): string => {
  const durationMs = endDate.getTime() - startDate.getTime();
  
  if (durationMs < 0) return '0m';
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
};

/**
 * Format time remaining or elapsed in a more readable way
 */
export const formatElapsedTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  
  // Future date
  if (diffMs < 0) return 'Soon';
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays}d ago`;
  }
  
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  
  if (diffMinutes > 0) {
    return `${diffMinutes}m ago`;
  }
  
  return 'Just now';
};
