import React, { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  getYear,
  setMonth
} from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { DayEventTypes } from "@/types/calendar.types";
import CalendarDayCell from "@/components/dashboard/home/CalendarDayCell";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Default number of weeks to show (6 gives us a standard calendar grid)
const DEFAULT_WEEKS_TO_SHOW = 6;

interface CalendarData {
  day: Date;
  events: any[];
}

interface FullScreenCalendarProps {
  className?: string;
  data?: CalendarData[];
  isLoading?: boolean;
  onSelectDay?: (date: Date) => void;
  onAddEntry?: () => void;
}

export function FullScreenCalendar({
  className,
  data = [],
  isLoading = false,
  onSelectDay,
  onAddEntry
}: FullScreenCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(startOfMonth(today));
    setSelectedDate(today);
    if (onSelectDay) {
      onSelectDay(today);
    }
  };

  const handleMonthChange = (monthValue: string) => {
    // Parse the month value (0-11) and set the month while keeping the year
    const newMonth = parseInt(monthValue, 10);
    const newDate = setMonth(currentMonth, newMonth);
    setCurrentMonth(startOfMonth(newDate));
  };

  // Create a grid of days for the current month view
  const days = eachDayOfInterval({
    start: currentMonth,
    end: endOfMonth(currentMonth)
  });
  
  // Fill out the grid with days from previous/next months
  const firstDayOfMonth = days[0];
  const dayOfWeek = firstDayOfMonth.getDay();
  
  // Add days from previous month to fill the first row
  const daysFromPreviousMonth = [];
  for (let i = dayOfWeek; i > 0; i--) {
    const date = new Date(firstDayOfMonth);
    date.setDate(date.getDate() - i);
    daysFromPreviousMonth.push(date);
  }
  
  // Add days from next month to fill out the grid to a standard 6 weeks
  const totalDays = daysFromPreviousMonth.length + days.length;
  const daysNeeded = DEFAULT_WEEKS_TO_SHOW * 7 - totalDays;
  const daysFromNextMonth = [];
  
  if (daysNeeded > 0) {
    const lastDay = days[days.length - 1];
    for (let i = 1; i <= daysNeeded; i++) {
      const date = new Date(lastDay);
      date.setDate(date.getDate() + i);
      daysFromNextMonth.push(date);
    }
  }
  
  const allDays = [...daysFromPreviousMonth, ...days, ...daysFromNextMonth];
  
  // Group days into weeks for rendering
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }
  
  // Handle calendar day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    if (onSelectDay) {
      onSelectDay(day);
    }
  };
  
  // Map dates to event types
  const getDayEventTypes = (day: Date): DayEventTypes => {
    const dayEvents = data.find(d => isSameDay(new Date(d.day), day))?.events || [];
    
    return {
      hasTasks: dayEvents.some(event => event.type === 'task'),
      hasBookings: dayEvents.some(event => event.type === 'booking'),
      hasEvents: dayEvents.some(event => event.type === 'event'),
      hasManualEntries: dayEvents.some(event => event.type === 'manual'),
      hasReminders: dayEvents.some(event => event.type === 'reminder'),
    };
  };

  // Generate months for dropdown
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = getYear(currentMonth);
  const currentMonthIndex = currentMonth.getMonth();
  
  // Calendar header for desktop
  const calendarHeader = (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Select 
          value={currentMonthIndex.toString()} 
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{format(currentMonth, 'MMMM yyyy')}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {monthNames.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {`${month} ${currentYear}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleTodayClick}
        >
          <CalendarIcon className="h-4 w-4 mr-1" /> Today
        </Button>
        
        {onAddEntry && (
          <Button onClick={onAddEntry} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Entry
          </Button>
        )}
      </div>
    </div>
  );
  
  // Calendar header for mobile
  const mobileHeader = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select 
          value={currentMonthIndex.toString()} 
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue>{format(currentMonth, 'MMM yyyy')}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {monthNames.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {`${month} ${currentYear}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleTodayClick}
          className="text-xs px-2 h-8"
        >
          <CalendarIcon className="h-3 w-3 mr-1" /> Today
        </Button>
        
        {onAddEntry && (
          <Button onClick={onAddEntry} size="sm" className="text-xs px-2 h-8">
            <Plus className="h-3 w-3 mr-1" />
            New Entry
          </Button>
        )}
      </div>
    </div>
  );
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="px-5">
        <CardTitle className="tracking-tight">
          <div className="hidden md:block">
            {calendarHeader}
          </div>
          <div className="block md:hidden">
            {mobileHeader}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 md:px-5">
        {isLoading ? (
          // Skeleton loader for calendar
          <div className="grid grid-cols-7 gap-1">
            {Array(42).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 text-center text-sm">
            {/* Day headings */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-1 mb-1 text-muted-foreground hidden md:block font-medium">
                {day}
              </div>
            ))}
            {/* Mobile day headings */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="p-1 mb-1 text-muted-foreground block md:hidden font-medium">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {weeks.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((day) => {
                  const eventTypes = getDayEventTypes(day);
                  const isSelected = isSameDay(day, selectedDate);
                  
                  return (
                    <CalendarDayCell
                      key={day.toISOString()}
                      date={day}
                      selected={isSelected}
                      eventTypes={eventTypes}
                      onSelect={handleDayClick}
                      className="aspect-square h-14 p-1 border border-border hover:bg-muted/50"
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
