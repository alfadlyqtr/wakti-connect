
import React, { useState, useEffect } from 'react';
import { format, isSameDay, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import CalendarEventList from './CalendarEventList';
import { CalendarEvent } from "@/types/calendar.types";
import CalendarEntryDialog from './CalendarEntryDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { fetchAllCalendarItems } from '@/services/calendar/fetchEventsService';
import CreateEventButton from '@/components/events/CreateEventButton';
import { useIsMobile } from '@/hooks/use-mobile';

const EnhancedCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  
  // Handle navigation
  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Handle new calendar entry
  const handleNewEntry = (entry: any) => {
    // Create a new CalendarEvent from the entry
    const newEvent: CalendarEvent = {
      id: entry.id,
      title: entry.title,
      date: new Date(entry.date),
      type: 'manual',
      description: entry.description,
      location: entry.location
    };
    
    // Add the new event to the events list
    setEvents(prev => [...prev, newEvent]);
    
    // If the new event is for the selected date, add it to filtered events
    if (isSameDay(new Date(entry.date), selectedDate)) {
      setFilteredEvents(prev => [...prev, newEvent]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
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
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/3">
          <Card className="bg-white dark:bg-gray-800 shadow-md h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</h3>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                  <CreateEventButton startDate={selectedDate} />
                </div>
              </div>
              
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
      </div>
      
      {isDialogOpen && userId && (
        <CalendarEntryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleNewEntry}
          selectedDate={selectedDate}
          userId={userId}
        />
      )}
    </div>
  );
};

export default EnhancedCalendar;
