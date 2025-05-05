
import React from "react";
import { format, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { EventDot } from "@/components/dashboard/home/EventDot";
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
  const totalEvents = taskCount + eventCount + bookingCount + manualCount;
  const hasMoreEvents = totalEvents > 3;

  // Check if this is the current day
  const isCurrentDay = isToday(date);
  
  return (
    <div 
      {...props}
      onClick={handleClick}
      className={cn(
        "aspect-square relative hover:bg-muted cursor-pointer transition-colors p-1",
        selected ? "bg-primary/10 font-bold" : "bg-white dark:bg-gray-900",
        !isSameMonth(date, new Date()) && "text-muted-foreground opacity-50",
        isCurrentDay && !selected && "border-primary border-2 font-bold",
        props.className
      )}
    >
      <time 
        dateTime={format(date, 'yyyy-MM-dd')} 
        className={cn(
          "flex items-center justify-center font-medium text-xs rounded-full w-6 h-6 mb-1",
          isCurrentDay ? "bg-primary text-primary-foreground" : "",
          selected ? "text-primary" : ""
        )}
      >
        {format(date, 'd')}
      </time>
      
      {/* Event indicators - displayed as colored dots */}
      {totalEvents > 0 && (
        <div className="mt-1 space-y-1 max-h-[80%] overflow-hidden">
          {prioritizedEvents.map((event, idx) => (
            <div 
              key={`${event.id}-${idx}`} 
              className={cn(
                "text-xs px-1 py-0.5 rounded truncate w-full",
                event.type === 'task' ? "bg-amber-100 text-amber-800" : "",
                event.type === 'event' ? "bg-purple-100 text-purple-800" : "",
                event.type === 'booking' ? "bg-blue-100 text-blue-800" : "",
                event.type === 'manual' ? "bg-orange-100 text-orange-800" : ""
              )}
            >
              {event.title}
            </div>
          ))}
          
          {/* Show "more" indicator if needed */}
          {hasMoreEvents && (
            <div className="text-xs text-center text-muted-foreground">
              +{totalEvents - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  );
};
