
import { format, differenceInHours, differenceInMinutes, parseISO } from "date-fns";

// Format a date string to a more readable format
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Format a time string to a more readable format
export const formatTime = (timeString: string | null): string => {
  if (!timeString) return "N/A";
  try {
    const date = new Date(timeString);
    return format(date, "h:mm a");
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid time";
  }
};

// Format a date and time string to a more readable format
export const formatDateTime = (dateTimeString: string | null): string => {
  if (!dateTimeString) return "N/A";
  try {
    const date = new Date(dateTimeString);
    return format(date, "MMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Error formatting date time:", error);
    return "Invalid date/time";
  }
};

// Calculate the number of hours between two timestamps
export const calculateHours = (startTime: string | null, endTime: string | null): string => {
  if (!startTime || !endTime) return "In progress";
  
  try {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    
    const hours = differenceInHours(end, start);
    const minutes = differenceInMinutes(end, start) % 60;
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${minutes} min`;
    }
  } catch (error) {
    console.error("Error calculating hours:", error);
    return "Error";
  }
};

// Generate date range for recurring events
export const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};
