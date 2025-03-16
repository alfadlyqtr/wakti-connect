
import { useQuery } from "@tanstack/react-query";
import { CalendarEvent } from "@/types/calendar.types";
import {
  fetchUserProfile,
  fetchTasks,
  fetchAllAppointments,
  fetchBookings
} from "@/services/calendar";

export const useCalendarEvents = () => {
  return useQuery({
    queryKey: ['calendarEvents'],
    queryFn: async (): Promise<CalendarEvent[]> => {
      try {
        // Fetch user profile first to get account type
        const { userId, accountType } = await fetchUserProfile();
        
        // Initialize empty events array
        let events: CalendarEvent[] = [];
        
        // 1. Fetch tasks (all account types)
        const taskEvents = await fetchTasks(userId);
        events = [...events, ...taskEvents];
        
        // 2. Fetch appointments (individual and business accounts)
        if (accountType === 'individual' || accountType === 'business') {
          const appointmentEvents = await fetchAllAppointments(userId);
          events = [...events, ...appointmentEvents];
        }
        
        // 3. Fetch bookings (business accounts only)
        if (accountType === 'business') {
          const bookingEvents = await fetchBookings(userId);
          events = [...events, ...bookingEvents];
        }
        
        return events;
      } catch (error) {
        console.error("Error fetching calendar events:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
};
