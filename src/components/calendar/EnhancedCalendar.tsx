
import React, { useState, useEffect } from 'react';
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent, DayEventTypes } from "@/types/calendar.types";
import CalendarEventList from "@/components/calendar/CalendarEventList";
import CalendarDayCell from "@/components/dashboard/home/CalendarDayCell";
import CalendarLegend from "@/components/dashboard/home/CalendarLegend";
import CalendarEntryDialog from './CalendarEntryDialog';
import { useQuery } from '@tanstack/react-query';
import { fetchManualEntries } from '@/services/calendar/manualEntryService';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/use-theme';

const EnhancedCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { theme } = useTheme();

  // Get current userId
  useEffect(() => {
    supabase.auth.getSession().then(result => {
      const id = result.data?.session?.user?.id;
      setUserId(id || null);
    });
  }, []);

  // Fetch manual calendar entries
  const { data: manualEntries = [], isLoading: isLoadingManual } = useQuery({
    queryKey: ['manualEntries', userId],
    queryFn: () => userId ? fetchManualEntries(userId) : Promise.resolve([]),
    enabled: !!userId,
  });

  // Update events when manual entries are loaded
  useEffect(() => {
    if (manualEntries && manualEntries.length > 0) {
      setEvents(manualEntries);
    }
  }, [manualEntries]);

  // Helper: filter events for specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getEventTypesForDate = (date: Date): DayEventTypes => {
    const dateEvents = getEventsForDate(date);
    return {
      hasTasks: dateEvents.some(event => event.type === "task"),
      hasBookings: dateEvents.some(event => event.type === "booking"),
      hasEvents: dateEvents.some(event => event.type === "event"),
      hasManualEntries: dateEvents.some(event => event.type === "manual")
    };
  };

  // Handle new entry creation
  const handleAddEntry = (entry: any) => {
    setEvents((prev) => [...prev, entry]);
  };

  // Navigation functions
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Generate calendar grid
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get start of the week (Sunday)
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // Get end of the calendar view
    const endDate = new Date(lastDay);
    const daysToAdd = 6 - endDate.getDay();
    endDate.setDate(lastDay.getDate() + daysToAdd);
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  
  // Group days into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="flex items-center gap-1 bg-primary hover:bg-primary/90"
        >
          <Plus size={16} />
          Add Entry
        </Button>
      </div>

      <Card className={`border shadow-sm ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white'}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevMonth}
              className={`rounded-full ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : ''}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextMonth}
              className={`rounded-full ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : ''}`}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className={`w-full rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800/30 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-0">
              {weekdays.map((day, i) => (
                <div 
                  key={i} 
                  className={`text-center p-2 font-medium text-sm border-b ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-gray-300 border-gray-700' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-0">
                {week.map((date, i) => {
                  const isSelected = isSameDay(date, selectedDate);
                  const today = isToday(date);
                  const sameMonth = isSameMonth(date, currentMonth);
                  
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        min-h-[80px] sm:min-h-[100px] border ${i < 6 ? 'border-r' : ''} ${weekIndex < weeks.length - 1 ? 'border-b' : ''} 
                        ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                        ${isSelected 
                          ? theme === 'dark' 
                            ? 'bg-blue-900/30 hover:bg-blue-900/40' 
                            : 'bg-blue-50 hover:bg-blue-100' 
                          : today 
                            ? theme === 'dark'
                              ? 'bg-gray-700/50 hover:bg-gray-700/70'
                              : 'bg-purple-50/50 hover:bg-purple-50'
                            : theme === 'dark'
                              ? 'hover:bg-gray-700/30'
                              : 'hover:bg-gray-50'
                        }
                        ${!sameMonth && (theme === 'dark' ? 'opacity-40' : 'opacity-50')}
                        relative cursor-pointer transition-colors
                      `}
                    >
                      <CalendarDayCell
                        date={date}
                        selected={isSelected}
                        eventTypes={getEventTypesForDate(date)}
                        onSelect={(date) => setSelectedDate(date)}
                        className={`h-full w-full ${
                          theme === 'dark' && isSelected ? 'text-blue-200' : ''
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CalendarLegend showManualEntries={true} />

      {getEventsForDate(selectedDate).length > 0 ? (
        <Card className={theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : ''}>
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {format(selectedDate, "MMMM d, yyyy")}
              </h2>
            </div>
            <CalendarEventList events={getEventsForDate(selectedDate)} />
          </CardContent>
        </Card>
      ) : (
        <Card className={theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : ''}>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No events for {format(selectedDate, "MMMM d, yyyy")}
            </p>
            <Button 
              variant="outline" 
              className={`mt-4 ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus size={16} className="mr-2" />
              Add an entry
            </Button>
          </CardContent>
        </Card>
      )}

      {userId && (
        <CalendarEntryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleAddEntry}
          selectedDate={selectedDate}
          userId={userId}
        />
      )}
    </div>
  );
};

export default EnhancedCalendar;
