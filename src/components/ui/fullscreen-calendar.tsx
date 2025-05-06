
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, parse } from 'date-fns';
import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CalendarDayCell from '@/components/dashboard/home/CalendarDayCell';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  // Handle month selection
  const handleMonthChange = (value: string) => {
    const [month, year] = value.split('-');
    const newDate = new Date(parseInt(year), parseInt(month), 1);
    setCurrentMonth(newDate);
  };
  
  // Generate month options for the dropdown
  const monthOptions = React.useMemo(() => {
    const options = [];
    const currentYear = new Date().getFullYear();
    
    // Add months for current year and next year
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1);
        options.push({
          value: `${month}-${year}`,
          label: format(date, 'MMMM yyyy')
        });
      }
    }
    
    return options;
  }, []);
  
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
    <div className="h-full flex flex-col w-full">
      <div className="p-3 md:p-4 flex items-center justify-between border-b">
        <div className="flex-1 max-w-[180px] md:max-w-xs">
          <Select 
            value={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {format(currentMonth, 'MMMM yyyy')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {onAddEntry && (
          <Button size="sm" variant="outline" onClick={onAddEntry} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-1" /> Add Entry
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto w-full">
        <div className="grid grid-cols-7 h-full w-full max-w-none">
          {/* Weekday headers */}
          {dayNames.map((day, i) => (
            <div key={i} className="p-1 md:p-2 text-center text-sm font-medium border-b">
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
