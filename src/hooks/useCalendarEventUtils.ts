
import { CalendarEvent, DayEventTypes } from "@/types/calendar.types";

export const useCalendarEventUtils = (events: CalendarEvent[] = []) => {
  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Function to check if a date has events
  const dateHasEvents = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };
  
  // Function to check what type of events a date has
  const getEventTypesForDate = (date: Date): DayEventTypes => {
    const dateEvents = getEventsForDate(date);
    return {
      hasTasks: dateEvents.some(event => event.type === 'task'),
      hasAppointments: dateEvents.some(event => event.type === 'appointment'),
      hasBookings: dateEvents.some(event => event.type === 'booking')
    };
  };

  return {
    getEventsForDate,
    dateHasEvents,
    getEventTypesForDate
  };
};
