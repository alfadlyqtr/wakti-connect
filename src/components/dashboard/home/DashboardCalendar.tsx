
import React, { useEffect, useState } from 'react';
import { format, startOfMonth, startOfWeek, endOfMonth, endOfWeek, eachDayOfInterval, addDays, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TaskList } from './TaskList';
import { CalendarEvent } from '@/types/calendar.types';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import CalendarLegend from './CalendarLegend';
import { EventDot } from './EventDot';
import EventCountBadge from './EventCountBadge';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Helper function to get days for the calendar view
const getDaysForCalendarView = (date: Date) => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
};

// Format day of month with ordinal suffix
const formatDayWithOrdinal = (day: number) => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const relevantDigits = (day % 100);
  const suffix = (relevantDigits >= 11 && relevantDigits <= 13) ? 'th' : suffixes[(day % 10)] || 'th';
  return `${day}${suffix}`;
};

interface DashboardCalendarProps {
  isCompact?: boolean;
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ isCompact = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  // Use the unified calendar hook
  const { events, isLoading } = useCalendarEvents();
  
  // Update calendar days when month changes
  useEffect(() => {
    setCalendarDays(getDaysForCalendarView(currentMonth));
  }, [currentMonth]);

  // Navigation functions
  const nextMonth = () => {
    setCurrentMonth(prevMonth => {
      const nextMonth = new Date(prevMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
  };

  const prevMonth = () => {
    setCurrentMonth(prevMonth => {
      const prevMonthDate = new Date(prevMonth);
      prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
      return prevMonthDate;
    });
  };

  // Filter events for the selected day
  const selectedDayEvents = events.filter(event => 
    event.date && isSameDay(new Date(event.date), selectedDay)
  );

  // Group events by type for the calendar cells
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      event.date && isSameDay(new Date(event.date), day)
    );
  };

  // Render day names row
  const renderDayNames = () => {
    // Use abbreviated day names on mobile
    const dayNames = isMobile ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames.map(day => (
      <div key={day} className="py-1 md:py-2 text-xs md:text-sm font-medium">
        {day}
      </div>
    ));
  };

  // Render a single calendar day cell
  const renderCalendarDay = (day: Date, index: number) => {
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const isToday = isSameDay(day, new Date());
    const isSelected = isSameDay(day, selectedDay);
    const dayEvents = getEventsForDay(day);
    
    // Count events by type
    const eventCounts = {
      tasks: dayEvents.filter(e => e.type === 'task').length,
      events: dayEvents.filter(e => e.type === 'event').length,
      bookings: dayEvents.filter(e => e.type === 'booking').length,
      manualEntries: dayEvents.filter(e => e.type === 'manual').length,
      reminders: dayEvents.filter(e => e.type === 'reminder').length
    };
    
    const hasEvents = dayEvents.length > 0;
    
    return (
      <div
        key={index}
        className={`
          relative h-9 md:h-12 p-0.5 md:p-1 border-t
          ${isCurrentMonth ? 'bg-background' : 'bg-muted/30 text-muted-foreground'}
          ${isSelected ? 'bg-accent' : ''}
          ${isToday ? 'font-bold' : ''}
        `}
        onClick={() => setSelectedDay(day)}
      >
        <div className="flex justify-between items-start h-full">
          <span className={`text-xs md:text-sm ${isSelected ? 'text-accent-foreground' : ''}`}>
            {day.getDate()}
          </span>
          
          {/* Show event dots only if space allows (md and up) */}
          {hasEvents && !isMobile && (
            <div className="flex flex-wrap gap-0.5 justify-end">
              {eventCounts.tasks > 0 && <EventDot type="task" />}
              {eventCounts.events > 0 && <EventDot type="event" />}
              {eventCounts.bookings > 0 && <EventDot type="booking" />}
              {eventCounts.manualEntries > 0 && <EventDot type="manual" />}
              {eventCounts.reminders > 0 && <EventDot type="reminder" />}
            </div>
          )}
          
          {/* On mobile, just show a dot indicator if events exist */}
          {hasEvents && isMobile && (
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-primary"></div>
          )}
          
          {/* Show count badge only on non-mobile */}
          {hasEvents && dayEvents.length > 1 && !isMobile && (
            <div className="absolute bottom-0.5 right-0.5 hidden md:block">
              <EventCountBadge count={dayEvents.length} />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render all calendar days
  const renderCalendarDays = () => {
    return calendarDays.map((day, index) => renderCalendarDay(day, index));
  };

  return (
    <Card className="h-full w-full">
      {/* Calendar header */}
      <div className="p-2 md:p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="h-6 w-6 md:h-7 md:w-7"
            >
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-6 w-6 md:h-7 md:w-7"
            >
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
          <h2 className="text-sm md:text-lg font-semibold">
            {format(currentMonth, isMobile ? 'MMM yyyy' : 'MMMM yyyy')}
          </h2>
          {/* Hide legend on mobile for space */}
          <div className="hidden md:block">
            <CalendarLegend />
          </div>
        </div>
      </div>
      
      {/* Calendar grid - Add max-width none to ensure full width on mobile */}
      <div className="grid grid-cols-7 gap-px text-xs text-center max-w-none w-full">
        {/* Day names row */}
        {renderDayNames()}
        
        {/* Calendar days */}
        {renderCalendarDays()}
      </div>
      
      {/* Selected day's events */}
      <div className="p-2 md:p-4 border-t">
        <h3 className="text-xs md:text-sm font-medium mb-2 md:mb-3">
          {format(selectedDay, isMobile ? 'MMM d, yy' : 'MMMM d, yyyy')} 
          {isLoading && <span className="ml-2 text-xs text-muted-foreground">(Loading...)</span>}
        </h3>
        {selectedDayEvents.length ? (
          // Pass only tasks prop, not onDelete since this is display-only
          <TaskList tasks={selectedDayEvents} />
        ) : (
          <div className="text-center py-2 text-xs md:text-sm text-muted-foreground">
            No events for this day
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardCalendar;
