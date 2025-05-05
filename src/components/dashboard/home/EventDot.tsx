
import React from "react";
import { cn } from "@/lib/utils";

interface EventDotProps {
  type: "task" | "booking" | "event" | "manual";
  className?: string;
}

export const EventDot: React.FC<EventDotProps> = ({ type, className }) => {
  const dotColor = {
    task: "bg-amber-500",
    booking: "bg-blue-500",
    event: "bg-purple-500",
    manual: "bg-orange-500",
  };

  return (
    <div
      className={cn(
        "h-1.5 w-1.5 rounded-full",
        dotColor[type],
        className
      )}
    />
  );
};
