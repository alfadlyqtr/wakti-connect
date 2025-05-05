
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import CalendarEntryDialog from './CalendarEntryDialog';
import CalendarEventList from './CalendarEventList';
import { CalendarEvent } from '@/types/calendar.types';
import { EventDot } from '@/components/dashboard/home/EventDot';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEvents } from '@/services/calendar/fetchEventsService';
import { fetchTasks } from '@/services/calendar/fetchTasksService';
import { fetchBookings } from '@/services/calendar/fetchBookingsService';
import { fetchManualEntries } from '@/services/calendar/manualEntryService';
import { useUserRole } from '@/features/auth/hooks/useUserRole';

const EnhancedCalendar: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { userRole, isIndividual, isBusiness, isStaff } = useUserRole();

  useEffect(() => {
    // Get current user ID
    supabase.auth.getSession().then(result => {
      const id = result.data?.session?.user?.id;
      setUserId(id || null);
    });
  }, []);

  // Query for tasks - only for business and individual users
  const { data: taskEvents = [] } = useQuery({
    queryKey: ['calendarTasks', userId],
    queryFn: async () => {
      if (!userId || isStaff) return []; 
      return await fetchTasks(userId);
    },
    enabled: !!userId && (isBusiness || isIndividual)
  });

  // Query for events - only for business and individual users
  const { data: eventEvents = [] } = useQuery({
    queryKey: ['calendarEvents', userId],
    queryFn: async () => {
      if (!userId || isStaff) return []; 
      return await fetchEvents(userId);
    },
    enabled: !!userId && (isBusiness || isIndividual)
  });

  // Query for bookings - for business and staff users
  const { data: bookingEvents = [] } = useQuery({
    queryKey: ['calendarBookings', userId],
    queryFn: async () => {
      if (!userId || isIndividual) return []; 
      return await fetchBookings(userId);
    },
    enabled: !!userId && (isBusiness || isStaff)
  });

  // Query for manual entries - for all users
  const { data: manualEvents = [] } = useQuery({
    queryKey: ['calendarManualEntries', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await fetchManualEntries(userId);
    },
    enabled: !!userId
  });

  // Combine all events based on user role
  const events = React.useMemo(() => {
    let combinedEvents: CalendarEvent[] = [];
    
    // Add manual entries for everyone
    combinedEvents = [...manualEvents];
    
    // Add tasks for business and individual users
    if (isBusiness || isIndividual) {
      combinedEvents = [...combinedEvents, ...taskEvents];
    }
    
    // Add events for business and individual users
    if (isBusiness || isIndividual) {
      combinedEvents = [...combinedEvents, ...eventEvents];
    }
    
    // Add bookings for business and staff users
    if (isBusiness || isStaff) {
      combinedEvents = [...combinedEvents, ...bookingEvents];
    }
    
    return combinedEvents;
  }, [taskEvents, eventEvents, bookingEvents, manualEvents, isBusiness, isIndividual, isStaff]);

  const handleAddEntry = (newEntry: any) => {
    // Convert the entry from the backend into our CalendarEvent format
    const calendarEvent: CalendarEvent = {
      id: newEntry.id,
      title: newEntry.title,
      date: new Date(newEntry.date),
      type: 'manual',
      description: newEntry.description,
      location: newEntry.location
    };
    
    // The event will be automatically added via React Query refetch
  };

  // Filter events for the selected day
  const selectedDateEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );

  // Filter events to get dots for each day with events
  const getEventDots = (day: Date) => {
    const dayEvents = events.filter(event => isSameDay(new Date(event.date), day));
    return {
      hasTasks: dayEvents.some(event => event.type === 'task'),
      hasBookings: dayEvents.some(event => event.type === 'booking'),
      hasEvents: dayEvents.some(event => event.type === 'event'),
      hasManualEntries: dayEvents.some(event => event.type === 'manual')
    };
  };

  const refreshQueries = () => {
    // This will be used to refresh data after a new manual entry is added
    if (userId) {
      const queryClient = useQueryClient();
      queryClient.invalidateQueries({ queryKey: ['calendarManualEntries'] });
    }
  };

  return (
    <div className="space-y-4">
      <Card className={`border ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <CalendarIcon className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-gray-300' : ''}`} />
              <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>Calendar</h3>
            </div>
            {userId && (
              <Button 
                size="sm" 
                onClick={() => setIsAddDialogOpen(true)}
                className={`${isDarkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : ''}`}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Entry
              </Button>
            )}
          </div>
          
          <div className={`p-3 ${isDarkMode ? 'bg-gray-800' : ''}`}>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className={`rounded-md ${isDarkMode ? 'bg-gray-800 text-gray-100' : ''} w-full`}
              components={{
                Day: ({ date: day, ...props }) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, date);
                  const eventDots = getEventDots(day);
                  
                  return (
                    <div
                      className={`
                        relative flex items-center justify-center h-10 w-full cursor-pointer
                        ${!isCurrentMonth ? 'text-gray-400' : ''}
                        ${isSelected && isDarkMode ? 'bg-blue-900/30 text-blue-100' : ''}
                        ${isSelected && !isDarkMode ? 'bg-blue-100 text-blue-900' : ''}
                        ${isDarkMode && !isSelected ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                      `}
                      onClick={() => setSelectedDate(day)}
                      {...props}
                    >
                      <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                      
                      {/* Event indicators */}
                      <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
                        {eventDots.hasTasks && <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                        {eventDots.hasBookings && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                        {eventDots.hasEvents && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                        {eventDots.hasManualEntries && <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />}
                      </div>
                    </div>
                  );
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Events for selected date */}
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <CardContent className="p-4">
          <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-gray-100' : ''}`}>
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          <CalendarEventList events={selectedDateEvents} />
        </CardContent>
      </Card>

      {/* Dialog for adding new entries */}
      {userId && (
        <CalendarEntryDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={(entry) => {
            handleAddEntry(entry);
            // Refresh data after adding a new entry
            const queryClient = useQueryClient();
            queryClient.invalidateQueries({ queryKey: ['calendarManualEntries', userId] });
          }}
          selectedDate={selectedDate}
          userId={userId}
        />
      )}
    </div>
  );
};

export default EnhancedCalendar;
