
import React from "react";
import { cn } from "@/lib/utils";

interface EventCountBadgeProps {
  count: number;
  label: string;
  className?: string;
}

const EventCountBadge: React.FC<EventCountBadgeProps> = ({ 
  count, 
  label,
  className
}) => {
  return (
    <span className={cn(
      "bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-0.5",
      className
    )}>
      {count} {label}
    </span>
  );
};

export default EventCountBadge;
