
import { useQuery } from "@tanstack/react-query";
import { CalendarEvent } from "@/types/calendar.types";

export const useCalendarEvents = () => {
  return useQuery({
    queryKey: ['calendarEvents'],
    queryFn: async (): Promise<CalendarEvent[]> => {
      // Appointments system has been deprecated
      console.warn("The appointments and calendar events system has been deprecated");
      return [];
    },
    refetchOnWindowFocus: false,
  });
};
