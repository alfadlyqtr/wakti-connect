
import { CalendarEvent, EventType } from "@/types/calendar.types";

interface EventColorOptions {
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const useCalendarEventUtils = () => {
  /**
   * Gets appropriate styling classes based on event type and status
   */
  const getEventColors = (event: CalendarEvent): EventColorOptions => {
    // Based on event type
    switch(event.type) {
      case "task":
        return {
          bgClass: "bg-amber-100",
          textClass: "text-amber-800",
          borderClass: "border-l-amber-500"
        };
      case "event":
        return {
          bgClass: "bg-purple-100",
          textClass: "text-purple-800",
          borderClass: "border-l-purple-500"
        };
      case "booking":
        return {
          bgClass: "bg-blue-100",
          textClass: "text-blue-800",
          borderClass: "border-l-blue-500"
        };
      case "manual":
        return {
          bgClass: "bg-orange-100",
          textClass: "text-orange-800",
          borderClass: "border-l-orange-500"
        };
      default:
        return {
          bgClass: "bg-slate-100",
          textClass: "text-slate-800",
          borderClass: "border-l-slate-500"
        };
    }
  };

  /**
   * Format date for display
   */
  const formatEventTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return {
    getEventColors,
    formatEventTime
  };
};
