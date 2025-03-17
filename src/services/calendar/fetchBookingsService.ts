
import { CalendarEvent } from "@/types/calendar.types";

// Fetch bookings (for business accounts)
export const fetchBookings = async (): Promise<CalendarEvent[]> => {
  console.warn("The bookings system has been deprecated");
  return [];
};
