
import React from "react";
import { format, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { EventDot } from "./EventDot";
import { DayEventTypes } from "@/types/calendar.types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface CalendarDayCellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  date: Date;
  selected?: boolean;
  eventTypes: DayEventTypes;
  onSelect: (date: Date) => void;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({ 
  date, 
  selected, 
  eventTypes,
  onSelect,
  ...props 
}) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    props.onClick?.(e);
    onSelect(date);
  };

  // Determine if today for highlighting
  const isCurrentDay = isToday(date);
  const hasEvents = eventTypes.hasTasks || eventTypes.hasBookings || 
                    eventTypes.hasEvents || eventTypes.hasManualEntries || 
                    eventTypes.hasReminders;

  return (
    <div 
      {...props}
      onClick={handleClick}
      className={cn(
        props.className,
        "relative group hover:bg-muted cursor-pointer transition-colors",
        // Base styles
        selected && "bg-primary text-primary-foreground",
        !isSameMonth(date, new Date()) && "text-muted-foreground opacity-50",
        // Always apply a prominent highlight for today's date, regardless of selection
        isCurrentDay && "ring-2 ring-primary ring-inset",
        // Make cells a bit larger on mobile for easier touch interaction
        isMobile && "h-16"
      )}
    >
      <time dateTime={format(date, 'yyyy-MM-dd')} className="font-medium">
        {format(date, 'd')}
      </time>
      
      {/* Simplified event indicators for mobile */}
      {isMobile && hasEvents ? (
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-primary"></div>
      ) : (
        /* Detailed event indicators for larger screens */
        hasEvents && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {eventTypes.hasTasks && <EventDot type="task" />}
            {eventTypes.hasBookings && <EventDot type="booking" />}
            {eventTypes.hasEvents && <EventDot type="event" />}
            {eventTypes.hasManualEntries && <EventDot type="manual" />}
            {eventTypes.hasReminders && <EventDot type="reminder" />}
          </div>
        )
      )}
    </div>
  );
};

export default CalendarDayCell;
