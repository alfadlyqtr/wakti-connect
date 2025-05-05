
import React from "react";
import { format, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { EventDot } from "./EventDot";
import { DayEventTypes } from "@/types/calendar.types";

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
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    props.onClick?.(e);
    onSelect(date);
  };

  return (
    <div 
      {...props}
      onClick={handleClick}
      className={cn(
        props.className,
        "relative h-full w-full cursor-pointer transition-colors p-1",
        selected && "bg-primary text-primary-foreground",
        !isSameMonth(date, new Date()) && "text-muted-foreground opacity-50",
        isToday(date) && !selected && "border border-primary",
      )}
    >
      <time dateTime={format(date, 'yyyy-MM-dd')} className="font-medium">
        {format(date, 'd')}
      </time>
      
      {/* Event indicators */}
      {(eventTypes.hasTasks || eventTypes.hasBookings || eventTypes.hasEvents || eventTypes.hasManualEntries) && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
          {eventTypes.hasTasks && <EventDot type="task" />}
          {eventTypes.hasBookings && <EventDot type="booking" />}
          {eventTypes.hasEvents && <EventDot type="event" />}
          {eventTypes.hasManualEntries && <EventDot type="manual" />}
        </div>
      )}
    </div>
  );
};

export default CalendarDayCell;
