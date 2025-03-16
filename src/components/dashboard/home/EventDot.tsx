
import React from "react";

interface EventDotProps {
  type: "task" | "appointment" | "booking";
}

const EventDot: React.FC<EventDotProps> = ({ type }) => {
  const colorClass = 
    type === "task" 
      ? "bg-amber-500" 
      : type === "appointment" 
        ? "bg-blue-500" 
        : "bg-green-500";
  
  return <span className={`h-1.5 w-1.5 rounded-full ${colorClass}`} />;
};

export default EventDot;
