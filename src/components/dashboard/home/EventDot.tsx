
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
    task: isDarkMode ? "bg-blue-400" : "bg-blue-500",
    booking: isDarkMode ? "bg-green-400" : "bg-green-500",
    event: isDarkMode ? "bg-amber-400" : "bg-amber-500",
    manual: isDarkMode ? "bg-purple-400" : "bg-purple-500"
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
