
import { WorkLog } from "../types";

// Calculate date range based on filter
export const getDateRange = (timeRange: string, customStartDate?: string, customEndDate?: string) => {
  const now = new Date();
  let startDate: Date | null = null;
  
  switch (timeRange) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case '30days':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      break;
    case 'custom':
      return { 
        start: customStartDate ? new Date(customStartDate) : null,
        end: customEndDate ? new Date(customEndDate) : null
      };
    default:
      return { start: null, end: null }; // All time
  }
  
  return { start: startDate, end: null };
};

// Format duration between start and end times
export const formatDuration = (startTime: string, endTime?: string) => {
  if (!endTime) return "In progress";
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHrs}h ${diffMins}m`;
};

// Calculate total duration in milliseconds
export const calculateTotalDuration = (logs: WorkLog[]): number => {
  return logs.reduce((total, log) => {
    if (!log.end_time) return total; // Skip active sessions
    
    const start = new Date(log.start_time);
    const end = new Date(log.end_time);
    return total + (end.getTime() - start.getTime());
  }, 0);
};

// Format milliseconds to human-readable duration
export const formatTotalDuration = (ms: number): string => {
  const totalHours = Math.floor(ms / (1000 * 60 * 60));
  const totalMinutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${totalHours}h ${totalMinutes}m`;
};

// Calculate total earnings
export const calculateTotalEarnings = (logs: WorkLog[]): number => {
  return logs.reduce((total, log) => {
    return total + (log.earnings || 0);
  }, 0);
};

// Count completed sessions
export const countCompletedSessions = (logs: WorkLog[]): number => {
  return logs.filter(log => log.end_time).length;
};

// Count active sessions
export const countActiveSessions = (logs: WorkLog[]): number => {
  return logs.filter(log => !log.end_time).length;
};
