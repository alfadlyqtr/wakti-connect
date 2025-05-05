
import React from "react";
import { format, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { DayEventTypes, CalendarEvent } from "@/types/calendar.types";

interface CalendarDayCellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  date: Date;
  selected?: boolean;
  eventTypes: DayEventTypes;
  onSelect: (date: Date) => void;
  events?: CalendarEvent[];
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({ 
  date, 
  selected, 
  eventTypes,
  onSelect,
  events = [],
  ...props 
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    props.onClick?.(e);
    onSelect(date);
  };

  // Count events by type (max 3 per type to avoid overcrowding)
  const taskCount = Math.min(events.filter(e => e.type === 'task').length, 3);
  const eventCount = Math.min(events.filter(e => e.type === 'event').length, 3);
  const bookingCount = Math.min(events.filter(e => e.type === 'booking').length, 3);
  const manualCount = Math.min(events.filter(e => e.type === 'manual').length, 3);
  
  // Sort events by type to display in order: bookings, events, tasks, manual
  const prioritizedEvents = [...events].sort((a, b) => {
    const typeOrder = { 'booking': 0, 'event': 1, 'task': 2, 'manual': 3 };
    return typeOrder[a.type] - typeOrder[b.type];
  }).slice(0, 3); // Only show max 3 events visually

  // Check if we need to show a "+X more" indicator
  const totalEvents = events.length;
  const hasMoreEvents = totalEvents > 3;

  // Check if this is the current day
  const isCurrentDay = isToday(date);
  
  return (
    <div 
      {...props}
      onClick={handleClick}
      className={cn(
        "aspect-square relative hover:bg-muted cursor-pointer transition-colors p-1",
        selected ? "bg-primary/5 font-medium" : "bg-white dark:bg-gray-900",
        !isSameMonth(date, new Date()) && "text-muted-foreground opacity-50",
        isCurrentDay && !selected && "border-primary border",
        props.className
      )}
    >
      <time 
        dateTime={format(date, 'yyyy-MM-dd')} 
        className={cn(
          "flex items-center justify-center text-xs font-medium w-6 h-6 mb-1",
          isCurrentDay ? "text-primary" : "",
          selected ? "text-primary" : ""
        )}
      >
        {format(date, 'd')}
      </time>
      
      {/* Event indicators - displayed as colored bars */}
      {totalEvents > 0 && (
        <div className="mt-1 space-y-1 max-h-[80%] overflow-hidden">
          {prioritizedEvents.map((event, idx) => (
            <div 
              key={`${event.id}-${idx}`} 
              className={cn(
                "h-1.5 rounded-full w-full",
                event.type === 'task' ? "bg-amber-500" : "",
                event.type === 'event' ? "bg-purple-500" : "",
                event.type === 'booking' ? "bg-blue-500" : "",
                event.type === 'manual' ? "bg-orange-500" : ""
              )}
            />
          ))}
          
          {/* Show "more" indicator if needed */}
          {hasMoreEvents && (
            <div className="text-xs text-center text-muted-foreground mt-0.5">
              +{totalEvents - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
