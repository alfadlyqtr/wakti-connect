
import React from "react";
import { EventType } from "@/types/calendar.types";

interface EventDotProps {
  type: EventType;
}

export const EventDot: React.FC<EventDotProps> = ({ type }) => {
  const getDotColor = () => {
    switch (type) {
      case "task":
        return "bg-amber-500";
      case "booking":
        return "bg-green-500";
      case "event":
        return "bg-blue-500";
      case "manual":
        return "bg-purple-500";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className={`h-1.5 w-1.5 rounded-full ${getDotColor()}`} />
  );
};
