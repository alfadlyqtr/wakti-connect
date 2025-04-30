
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  // Options for date formatting
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "";
  }
  
  // Options for time formatting
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleTimeString('en-US', options);
};

export const formatDateAndTime = (dateString: string): string => {
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

// Alias for formatDateAndTime to fix imports
export const formatDateTime = formatDateAndTime;

// Function to get relative date label - updated to ensure it accepts a Date object
export const getRelativeDateLabel = (date: Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Ensure we're working with a proper Date object
  const comparableDate = new Date(date);
  comparableDate.setHours(0, 0, 0, 0);
  
  if (comparableDate.getTime() === today.getTime()) {
    return "Today";
  } else if (comparableDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else if (comparableDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return formatDate(date.toISOString());
  }
};
