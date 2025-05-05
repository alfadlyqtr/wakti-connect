
import React from "react";
import { cn } from "@/lib/utils";

interface CalendarLegendProps {
  className?: string;
}

const CalendarLegend: React.FC<CalendarLegendProps> = ({ className }) => {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 text-sm", className)}>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-purple-500" />
        <span>Manual Entries</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-amber-500" />
        <span>Tasks</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-violet-500" />
        <span>Events</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span>Reminders</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-green-500" />
        <span>Bookings</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
