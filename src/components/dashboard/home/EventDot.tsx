
import React from "react";
import { cn } from "@/lib/utils";

interface EventDotProps {
  type: "task";
  isCompleted?: boolean;
  priority?: string;
}

export const EventDot: React.FC<EventDotProps> = ({ type, isCompleted, priority }) => {
  // Base classes
  const baseClasses = "h-2 w-2 rounded-full";
  
  // Get color based on type and status
  const getColorClass = () => {
    if (type === "task") {
      if (isCompleted) return "bg-green-500";
      
      // If not completed, use priority color
      switch (priority) {
        case "high":
          return "bg-red-500";
        case "medium":
          return "bg-amber-500";
        case "low":
          return "bg-green-500";
        default:
          return "bg-blue-500";
      }
    }
    
    return "bg-slate-500";
  };
  
  return <div className={cn(baseClasses, getColorClass())} />;
};
