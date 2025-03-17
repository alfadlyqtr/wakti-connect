
import { useState } from "react";
import { CalendarEvent } from "@/types/calendar.types";

export const useDayEventsDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  
  /**
   * Open the dialog for a specific day and show its events
   */
  const openDayDialog = (date: Date, events: CalendarEvent[]) => {
    setSelectedDate(date);
    setDayEvents(events);
    setIsOpen(true);
  };
  
  /**
   * Close the dialog
   */
  const closeDayDialog = () => {
    setIsOpen(false);
    setSelectedDate(null);
    setDayEvents([]);
  };
  
  /**
   * Get events grouped by type for display
   */
  const getGroupedEvents = () => {
    // Sort events by time
    const sortedEvents = [...dayEvents].sort((a, b) => 
      a.date.getTime() - b.date.getTime()
    );
    
    // Group by type
    const tasks = sortedEvents.filter(event => event.type === "task");
    
    return {
      tasks
    };
  };
  
  return {
    isOpen,
    selectedDate,
    dayEvents,
    openDayDialog,
    closeDayDialog,
    getGroupedEvents
  };
};
