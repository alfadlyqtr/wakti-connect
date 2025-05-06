
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import CalendarDayCell from '@/components/dashboard/home/CalendarDayCell';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface DayData {
  day: Date;
  events: Array<{
    id: string;
    type: string;
  }>;
}

interface FullScreenCalendarProps {
  data: DayData[];
  isLoading?: boolean;
  onSelectDay: (day: Date) => void;
  onAddEntry?: () => void;
}

export const FullScreenCalendar: React.FC<FullScreenCalendarProps> = ({
  data,
  isLoading = false,
  onSelectDay,
  onAddEntry
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  
  // Media queries
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Generate calendar days
  const calendarDays = React.useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Day names
  const dayNames = isMobile 
    ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] 
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Handle day selection
  const handleDaySelect = (day: Date) => {
    setSelectedDay(day);
    onSelectDay(day);
  };

  // Process events for a specific day
  const getEventTypesForDay = (day: Date) => {
    const dayEvents = data.find(d => isSameDay(new Date(d.day), day))?.events || [];
    
    return {
      hasTasks: dayEvents.some(e => e.type === 'task'),
      hasEvents: dayEvents.some(e => e.type === 'event'),
      hasBookings: dayEvents.some(e => e.type === 'booking'),
      hasManualEntries: dayEvents.some(e => e.type === 'manual'),
      hasReminders: dayEvents.some(e => e.type === 'reminder')
    };
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={prevMonth} className="mr-1">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextMonth} className="mr-3">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>
        {onAddEntry && (
          <Button size="sm" variant="outline" onClick={onAddEntry}>
            <Plus className="h-4 w-4 mr-1" /> Add Event
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 h-full">
          {/* Weekday headers */}
          {dayNames.map((day, i) => (
            <div key={i} className="p-2 text-center text-sm font-medium border-b">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, i) => (
            <CalendarDayCell
              key={i}
              date={day}
              selected={isSameDay(day, selectedDay)}
              eventTypes={getEventTypesForDay(day)}
              onSelect={handleDaySelect}
              className={`
                min-h-[60px] md:min-h-[80px] p-2 border
                ${!isSameMonth(day, currentMonth) ? 'bg-muted/20' : ''}
              `}
            />
          ))}
        </div>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading calendar...</div>
        </div>
      )}
    </div>
  );
};
