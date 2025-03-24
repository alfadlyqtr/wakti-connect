
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";

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
