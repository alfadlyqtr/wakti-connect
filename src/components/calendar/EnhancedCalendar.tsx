
import React, { useState, useEffect } from 'react';
import { format, isSameDay, addMonths, subMonths } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarEventList from './CalendarEventList';
import { CalendarEvent, DayEventTypes } from "@/types/calendar.types";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { fetchAllCalendarItems } from '@/services/calendar/fetchEventsService';
import { useIsMobile } from '@/hooks/use-mobile';
import CalendarDayCell from '@/components/dashboard/home/CalendarDayCell';

const EnhancedCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Get current user ID
  useEffect(() => {
    const getUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    
    getUserId();
  }, []);
  
  // Fetch calendar events when user ID is available
  useEffect(() => {
    const fetchCalendarData = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const calendarEvents = await fetchAllCalendarItems(userId);
          console.log("Calendar events loaded:", calendarEvents.length);
          setEvents(calendarEvents);
        } catch (error) {
          console.error('Error fetching calendar data:', error);
          toast({
            title: "Error",
            description: "Failed to load calendar events",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchCalendarData();
  }, [userId, toast]);
  
  // Filter events for selected date
  useEffect(() => {
    if (selectedDate && events.length > 0) {
      const eventsForDate = events.filter(event => 
        isSameDay(new Date(event.date), selectedDate)
      );
      setFilteredEvents(eventsForDate);
    } else {
      setFilteredEvents([]);
    }
  }, [selectedDate, events]);
  
  // Helper: get event types for a specific date
  const getEventTypesForDate = (date: Date): DayEventTypes => {
    const dateEvents = events.filter(event => isSameDay(new Date(event.date), date));
    return {
      hasTasks: dateEvents.some(event => event.type === "task"),
      hasBookings: dateEvents.some(event => event.type === "booking"),
      hasEvents: dateEvents.some(event => event.type === "event"),
      hasManualEntries: dateEvents.some(event => event.type === "manual")
    };
  };
  
  // Handle navigation
  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Calendar section - full width */}
      <Card className="bg-white dark:bg-gray-800 shadow-md mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
                {!isMobile && <span className="ml-1">Previous</span>}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextMonth}
              >
                {!isMobile && <span className="mr-1">Next</span>}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Loading calendar...</p>
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              className="rounded-md"
              components={{
                Day: ({ date, ...props }) => (
                  <CalendarDayCell
                    date={date}
                    selected={isSameDay(date, selectedDate)}
                    eventTypes={getEventTypesForDate(date)}
                    onSelect={(date) => setSelectedDate(date)}
                    {...props}
                  />
                ),
              }}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Events section - underneath calendar */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-4">{format(selectedDate, 'MMMM d, yyyy')}</h3>
          
          {filteredEvents.length > 0 ? (
            <CalendarEventList events={filteredEvents} />
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>No events for this date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCalendar;
