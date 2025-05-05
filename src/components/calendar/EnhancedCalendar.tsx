
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

const EnhancedCalendar: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    // Get current user ID
    supabase.auth.getSession().then(result => {
      const id = result.data?.session?.user?.id;
      setUserId(id || null);
      
      if (id) {
        fetchEvents(id);
      }
    });
  }, []);

  const fetchEvents = async (uid: string) => {
    try {
      // Fetch tasks with due dates
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('id, title, due_date, status')
        .eq('user_id', uid)
        .not('due_date', 'is', null);
      
      // Fetch manual calendar entries
      const { data: manualEntries, error: manualError } = await supabase
        .from('calendar_manual_entries')
        .select('*')
        .eq('user_id', uid);
      
      if (tasksError) console.error('Error fetching tasks:', tasksError);
      if (manualError) console.error('Error fetching manual entries:', manualError);

      const allEvents: CalendarEvent[] = [];

      // Process tasks
      if (tasksData) {
        tasksData.forEach(task => {
          allEvents.push({
            id: task.id,
            title: task.title,
            date: new Date(task.due_date),
            type: 'task',
            status: task.status
          });
        });
      }
      
      // Process manual entries
      if (manualEntries) {
        manualEntries.forEach(entry => {
          allEvents.push({
            id: entry.id,
            title: entry.title,
            date: new Date(entry.date),
            type: 'manual',
            description: entry.description,
            location: entry.location
          });
        });
      }
      
      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

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
    
    // Add the new event to our state
    setEvents(prev => [...prev, calendarEvent]);
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
              classNames={{
                months: "w-full",
                month: "w-full",
                table: "w-full border-collapse",
                head_row: "w-full flex",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center h-10 w-full focus-within:relative focus-within:z-20",
                day: "h-10 w-full p-0 aria-selected:opacity-100"
              }}
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
          onSuccess={handleAddEntry}
          selectedDate={selectedDate}
          userId={userId}
        />
      )}
    </div>
  );
};

export default EnhancedCalendar;
