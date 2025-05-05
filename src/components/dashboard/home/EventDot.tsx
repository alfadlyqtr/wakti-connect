
import React from "react";
import { EventType } from "@/types/calendar.types";

interface EventDotProps {
  type: EventType;
}

export const EventDot: React.FC<EventDotProps> = ({ type }) => {
  const getDotColor = () => {
    switch (type) {
      case "task":
        return "bg-amber-500"; // Amber for tasks
      case "booking":
        return "bg-green-500"; // Green for bookings
      case "event":
        return "bg-blue-500";  // Blue for events
      case "reminder":
        return "bg-yellow-400"; // Yellow for reminders  
      case "manual":
        return "bg-purple-500"; // Purple for manual entries
      default:
        return "bg-gray-500"; // Default fallback
    }
  };

  return (
    <div className={`h-1.5 w-1.5 rounded-full ${getDotColor()}`} />
  );
};
