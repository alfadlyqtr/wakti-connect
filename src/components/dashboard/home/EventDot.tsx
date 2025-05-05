
import React from "react";
import { EventType } from "@/types/calendar.types";

interface EventDotProps {
  type: EventType | "manual" | "reminder";
}

export const EventDot: React.FC<EventDotProps> = ({ type }) => {
  const getDotColor = () => {
    switch (type) {
      case "task":
        return "bg-amber-500"; // Matching our legend
      case "booking":
        return "bg-green-500"; // Matching our legend
      case "event":
        return "bg-violet-500"; // Added for events
      case "reminder":
        return "bg-yellow-400"; // Added for reminders  
      case "manual":
      default:
        return "bg-purple-500"; // Default for manual entries
    }
  };

  return (
    <div className={`h-1.5 w-1.5 rounded-full ${getDotColor()}`} />
  );
};
