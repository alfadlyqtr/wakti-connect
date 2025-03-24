
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, differenceInMinutes, differenceInHours } from "date-fns";
import { WorkLog } from "../types";

export const getDateRange = (
  timeRange: string,
  customStartDate?: string,
  customEndDate?: string
) => {
  const now = new Date();
  
  switch (timeRange) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
    case 'week':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }), // Week starts on Monday
        end: endOfWeek(now, { weekStartsOn: 1 })
      };
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    case '30days':
      return {
        start: startOfDay(subDays(now, 30)),
        end: endOfDay(now)
      };
    case 'custom':
      return {
        start: customStartDate ? new Date(customStartDate) : null,
        end: customEndDate ? new Date(customEndDate) : null
      };
    case 'all':
    default:
      return {
        start: null,
        end: null
      };
  }
};

/**
 * Format duration between start and end times
 * @param startTime - Start time as ISO string
 * @param endTime - End time as ISO string (optional)
 * @returns Formatted duration string
 */
export const formatDuration = (startTime: string, endTime?: string | null): string => {
  if (!endTime) return "In progress";
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMins = differenceInMinutes(end, start);
  
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  return `${hrs}h ${mins}m`;
};

/**
 * Calculate total duration of all work logs in minutes
 * @param workLogs - Array of work logs
 * @returns Total duration in minutes
 */
export const calculateTotalDuration = (workLogs: WorkLog[]): number => {
  return workLogs.reduce((total, log) => {
    if (!log.end_time) return total;
    
    const start = new Date(log.start_time);
    const end = new Date(log.end_time);
    return total + differenceInMinutes(end, start);
  }, 0);
};

/**
 * Format total duration in minutes to a readable string
 * @param totalMinutes - Total duration in minutes
 * @returns Formatted duration string
 */
export const formatTotalDuration = (totalMinutes: number): string => {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  return `${hrs}h ${mins}m`;
};

/**
 * Calculate total earnings from all work logs
 * @param workLogs - Array of work logs
 * @returns Total earnings amount
 */
export const calculateTotalEarnings = (workLogs: WorkLog[]): number => {
  return workLogs.reduce((total, log) => {
    return total + (log.earnings || 0);
  }, 0);
};

/**
 * Count completed sessions (with end time)
 * @param workLogs - Array of work logs
 * @returns Number of completed sessions
 */
export const countCompletedSessions = (workLogs: WorkLog[]): number => {
  return workLogs.filter(log => !!log.end_time).length;
};

/**
 * Count active sessions (without end time)
 * @param workLogs - Array of work logs
 * @returns Number of active sessions
 */
export const countActiveSessions = (workLogs: WorkLog[]): number => {
  return workLogs.filter(log => !log.end_time).length;
};
