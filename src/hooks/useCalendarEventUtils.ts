
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
    // For task events
    if (event.type === "task") {
      if (event.isCompleted) {
        return {
          bgClass: "bg-green-100",
          textClass: "text-green-800",
          borderClass: "border-green-300"
        };
      }

      // By priority
      switch (event.priority) {
        case "high":
          return {
            bgClass: "bg-red-100",
            textClass: "text-red-800",
            borderClass: "border-red-300"
          };
        case "medium":
          return {
            bgClass: "bg-amber-100",
            textClass: "text-amber-800", 
            borderClass: "border-amber-300"
          };
        case "low":
          return {
            bgClass: "bg-green-100",
            textClass: "text-green-800",
            borderClass: "border-green-300"
          };
        default:
          return {
            bgClass: "bg-blue-100",
            textClass: "text-blue-800",
            borderClass: "border-blue-300"
          };
      }
    }
    
    // Default styling
    return {
      bgClass: "bg-slate-100",
      textClass: "text-slate-800",
      borderClass: "border-slate-300"
    };
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
