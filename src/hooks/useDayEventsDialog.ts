
import { useState } from "react";
import { CalendarEvent } from "@/types/calendar.types";

interface UseDayEventsDialogReturn {
  isOpen: boolean;
  selectedDate: Date | null;
  events: CalendarEvent[];
  openDialog: (date: Date, events: CalendarEvent[]) => void;
  closeDialog: () => void;
  dialogEvents: {
    tasks: CalendarEvent[];
    appointments: CalendarEvent[];
    bookings: CalendarEvent[];
  };
}

export const useDayEventsDialog = (): UseDayEventsDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const openDialog = (date: Date, dayEvents: CalendarEvent[]) => {
    setSelectedDate(date);
    setEvents(dayEvents);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  // Group events by type for easier rendering
  const dialogEvents = {
    tasks: events.filter(event => event.type === "task"),
    appointments: events.filter(event => event.type === "appointment"),
    bookings: events.filter(event => event.type === "booking")
  };

  return {
    isOpen,
    selectedDate,
    events,
    openDialog,
    closeDialog,
    dialogEvents
  };
};
