
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

  // Count events by type
  const taskCount = events.filter(e => e.type === 'task').length;
  const eventCount = events.filter(e => e.type === 'event').length;
  const bookingCount = events.filter(e => e.type === 'booking').length;
  const manualCount = events.filter(e => e.type === 'manual').length;
  
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
        "h-full w-full relative hover:bg-muted/50 cursor-pointer transition-colors p-1",
        selected ? "bg-primary/5" : "",
        !isSameMonth(date, new Date()) && "text-muted-foreground opacity-50",
        isCurrentDay && !selected && "border-b-2 border-primary",
        "border-r border-b border-muted/40 last:border-r-0",
        props.className
      )}
    >
      <time 
        dateTime={format(date, 'yyyy-MM-dd')} 
        className={cn(
          "flex justify-end items-start text-xs font-medium p-1",
          isCurrentDay ? "text-primary font-medium" : "",
          selected ? "text-primary font-medium" : ""
        )}
      >
        {format(date, 'd')}
      </time>
      
      {/* Event indicators - displayed as colored bars */}
      {totalEvents > 0 && (
        <div className="absolute bottom-1 left-1 right-1 space-y-1">
          {prioritizedEvents.map((event, idx) => (
            <div 
              key={`${event.id}-${idx}`} 
              className={cn(
                "h-1 rounded-sm w-full",
                event.type === 'task' ? "bg-amber-500" : "",
                event.type === 'event' ? "bg-purple-500" : "",
                event.type === 'booking' ? "bg-blue-500" : "",
                event.type === 'manual' ? "bg-orange-500" : ""
              )}
            />
          ))}
          
          {/* Show "more" indicator if needed */}
          {hasMoreEvents && (
            <div className="text-[10px] text-right text-muted-foreground mt-0.5 pr-0.5">
              +{totalEvents - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
