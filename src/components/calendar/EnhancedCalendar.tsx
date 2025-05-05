
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarEvent, DayEventTypes, ManualCalendarEntry } from "@/types/calendar.types";
import { format, isSameDay, addMonths, subMonths } from "date-fns";
import CalendarDayCell from "@/components/dashboard/home/CalendarDayCell";
import CalendarLegend from "@/components/dashboard/home/CalendarLegend";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CalendarEntryDialog from "./CalendarEntryDialog";
import CalendarEventList from "./CalendarEventList";
import { fetchTasks } from "@/services/calendar/fetchTasksService";
import { fetchEvents } from "@/services/calendar/fetchEventsService";
import { fetchManualEntries } from "@/services/calendar/manualEntryService";
import { cn } from "@/lib/utils";

interface EnhancedCalendarProps {
  isCompact?: boolean;
}

// Use this hook to get all calendar events
const useAllCalendarEvents = (userId: string | null) => {
  return useQuery({
    queryKey: ['allCalendarEvents', userId],
    queryFn: async () => {
      if (!userId) return [];
      let results: CalendarEvent[] = [];

      try {
        // Fetch tasks
        const tasks = await fetchTasks(userId);
        results = [...results, ...tasks];
        
        // Fetch events
        const events = await fetchEvents(userId);
        results = [...results, ...events];
        
        // Fetch manual entries
        const manualEntries = await fetchManualEntries(userId);
        results = [...results, ...manualEntries];
        
        // Fetch bookings (where user is customer or business)
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('id, title, start_time, status')
          .or(`customer_id.eq.${userId},business_id.eq.${userId}`);
        
        if (bookingsData) {
          results.push(...bookingsData.map(booking => ({
            id: booking.id,
            title: booking.title,
            date: new Date(booking.start_time as string),
            type: "booking" as const,
            status: booking.status
          })));
        }
        
        return results;
      } catch (error) {
        console.error("Error fetching calendar events:", error);
        return [];
      }
    },
    enabled: !!userId,
  });
};

export const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  isCompact = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [userId, setUserId] = useState<string | null>(null);
  const [showAddEntryDialog, setShowAddEntryDialog] = useState(false);
  const queryClient = useQueryClient();

  // Get current userId for filtering
  useEffect(() => {
    supabase.auth.getSession().then(result => {
      const id = result.data?.session?.user?.id;
      setUserId(id || null);
    });
  }, []);

  // Get all calendar events
  const { data: events = [], isLoading } = useAllCalendarEvents(userId);

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

  const selectedDateEvents = getEventsForDate(selectedDate);

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleAddEntry = (newEntry: ManualCalendarEntry) => {
    // Invalidate the query to refetch calendar events
    queryClient.invalidateQueries({ queryKey: ['allCalendarEvents'] });
  };

  const calendarHeader = (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Card>
          <CardContent>
            <div className="h-52 flex items-center justify-center text-muted-foreground">Loading calendar…</div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            {!isCompact && (
              <h1 className="text-2xl font-bold">Calendar</h1>
            )}
            <Button 
              onClick={() => setShowAddEntryDialog(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Entry
            </Button>
          </div>

          <Card className={cn(
            "border bg-white dark:bg-gray-950 shadow-sm",
            isCompact ? "" : "p-4"
          )}>
            <CardHeader className="p-0 pb-4">
              {calendarHeader}
            </CardHeader>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                month={currentMonth}
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border bg-gradient-to-br from-white via-white to-[#E5DEFF]/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
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
            </CardContent>
          </Card>

          <CalendarLegend 
            showBookings={true}
            showEvents={true}
            showManualEntries={true}
          />

          {selectedDateEvents.length > 0 ? (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </h3>
                <Badge variant="outline" className="ml-2 bg-white/50 text-xs">
                  {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'event' : 'events'}
                </Badge>
              </div>

              <CalendarEventList 
                events={selectedDateEvents}
                userId={userId}
                onEventUpdate={() => queryClient.invalidateQueries({ queryKey: ['allCalendarEvents'] })}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 mt-4">
              No events for {format(selectedDate, "MMMM d, yyyy")}
            </div>
          )}
        </>
      )}

      {userId && (
        <CalendarEntryDialog
          isOpen={showAddEntryDialog}
          onClose={() => setShowAddEntryDialog(false)}
          onSuccess={handleAddEntry}
          selectedDate={selectedDate}
          userId={userId}
        />
      )}
    </div>
  );
};

export default EnhancedCalendar;
