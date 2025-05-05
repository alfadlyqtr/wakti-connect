
import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface EventDotProps {
  type: "task" | "booking" | "event" | "manual";
  className?: string;
}

export const EventDot: React.FC<EventDotProps> = ({ type, className }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const dotColor = {
    task: "bg-amber-500",
    booking: "bg-green-500",
    event: "bg-blue-500",
    manual: "bg-purple-500"
  };

  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full shadow-sm",
        dotColor[type],
        isDarkMode && "shadow-glow",
        className
      )}
    />
  );
};
