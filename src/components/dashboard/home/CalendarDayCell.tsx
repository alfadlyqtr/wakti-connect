
import React from "react";
import { format, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import EventDot from "./EventDot";
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
        "relative group hover:bg-muted cursor-pointer transition-colors",
        selected && "bg-primary text-primary-foreground",
        !isSameMonth(date, new Date()) && "text-muted-foreground opacity-50",
        isToday(date) && !selected && "border border-primary",
      )}
    >
      <time dateTime={format(date, 'yyyy-MM-dd')}>{format(date, 'd')}</time>
      
      {/* Event indicators */}
      {(eventTypes.hasTasks || eventTypes.hasAppointments || eventTypes.hasBookings) && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
          {eventTypes.hasTasks && <EventDot type="task" />}
          {eventTypes.hasAppointments && <EventDot type="appointment" />}
          {eventTypes.hasBookings && <EventDot type="booking" />}
        </div>
      )}
    </div>
  );
};

export default CalendarDayCell;
