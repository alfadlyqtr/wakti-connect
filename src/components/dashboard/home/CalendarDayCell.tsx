
import React from "react";
import { format, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { EventDot } from "./EventDot";
import { DayEventTypes } from "@/types/calendar.types";
import { useTheme } from "@/hooks/use-theme";

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
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const isCurrentMonth = isSameMonth(date, new Date());
  const isTodayDate = isToday(date);
  
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
        "h-full w-full cursor-pointer transition-colors p-2",
      )}
    >
      <div className={cn(
        "flex justify-between items-start",
        selected && isDarkMode && "text-blue-200",
      )}>
        <time 
          dateTime={format(date, 'yyyy-MM-dd')} 
          className={cn(
            "font-medium text-sm sm:text-base",
            !isCurrentMonth && "text-muted-foreground",
            isTodayDate && !selected && isDarkMode && "text-purple-300",
          )}>
          {format(date, 'd')}
        </time>
      </div>
      
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
