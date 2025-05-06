
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
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames.map(day => (
      <div key={day} className="py-2 font-medium">
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
          relative h-12 p-1 border-t
          ${isCurrentMonth ? 'bg-background' : 'bg-muted/30 text-muted-foreground'}
          ${isSelected ? 'bg-accent' : ''}
          ${isToday ? 'font-bold' : ''}
        `}
        onClick={() => setSelectedDay(day)}
      >
        <div className="flex justify-between items-start h-full">
          <span className={`text-xs ${isSelected ? 'text-accent-foreground' : ''}`}>
            {day.getDate()}
          </span>
          
          {hasEvents && (
            <div className="flex flex-wrap gap-0.5 justify-end">
              {eventCounts.tasks > 0 && <EventDot type="task" />}
              {eventCounts.events > 0 && <EventDot type="event" />}
              {eventCounts.bookings > 0 && <EventDot type="booking" />}
              {eventCounts.manualEntries > 0 && <EventDot type="manual" />}
              {eventCounts.reminders > 0 && <EventDot type="reminder" />}
            </div>
          )}
          
          {hasEvents && dayEvents.length > 1 && (
            <div className="absolute bottom-1 right-1">
              <EventCountBadge count={dayEvents.length} label="events" />
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
    <Card className="h-full">
      {/* Calendar header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
          <h2 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <CalendarLegend />
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px text-xs text-center">
        {/* Day names row */}
        {renderDayNames()}
        
        {/* Calendar days */}
        {renderCalendarDays()}
      </div>
      
      {/* Selected day's events */}
      <div className="p-4 border-t">
        <h3 className="font-medium mb-3">
          {format(selectedDay, 'MMMM d, yyyy')} 
          {isLoading && <span className="ml-2 text-xs text-muted-foreground">(Loading...)</span>}
        </h3>
        {selectedDayEvents.length ? (
          // Pass only tasks prop, not onDelete since this is display-only
          <TaskList tasks={selectedDayEvents} />
        ) : (
          <div className="text-center py-2 text-sm text-muted-foreground">
            No events for this day
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardCalendar;
