
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { CalendarEvent, CalendarViewProps } from "@/types/calendar.types";
import { CalendarDayCell } from "./CalendarDayCell";
import CalendarLegend from "@/components/dashboard/home/CalendarLegend";
import { CalendarDayView } from "./CalendarDayView";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCalendarEvents } from "@/services/calendar/fetchAllEventsService";
import { Skeleton } from "@/components/ui/skeleton";

export const UnifiedCalendar: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  view = 'month'
}) => {
  const [userId, setUserId] = useState<string | null>(null);

  // Get current userId
  useEffect(() => {
    supabase.auth.getSession().then(result => {
      const id = result.data?.session?.user?.id;
      setUserId(id || null);
    });
  }, []);

  // Fetch all calendar events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendarEvents', userId],
    queryFn: () => userId ? fetchAllCalendarEvents(userId) : Promise.resolve([]),
    enabled: !!userId,
  });

  // Get events for selected date
  const selectedDateEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );

  // Get event types for a specific date
  const getEventTypesForDate = (date: Date) => {
    const dateEvents = events.filter(event => isSameDay(new Date(event.date), date));
    
    return {
      hasTasks: dateEvents.some(event => event.type === "task"),
      hasBookings: dateEvents.some(event => event.type === "booking"),
      hasEvents: dateEvents.some(event => event.type === "event"),
      hasManualEntries: dateEvents.some(event => event.type === "manual")
    };
  };

  if (isLoading) {
    return <Skeleton className="w-full h-72" />;
  }

  if (view === 'day') {
    return (
      <CalendarDayView 
        selectedDate={selectedDate} 
        events={selectedDateEvents} 
      />
    );
  }

  if (view === 'week') {
    // Week view implementation would go here
    return <div>Week view (not implemented)</div>;
  }

  return (
    <div className="w-full">
      <div className="w-full bg-white dark:bg-gray-900 border-b">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          className="w-full border-none"
          components={{
            Day: ({ date, ...props }) => (
              <CalendarDayCell
                date={date}
                selected={isSameDay(date, selectedDate)}
                eventTypes={getEventTypesForDate(date)}
                onSelect={() => onDateSelect(date)}
                events={events.filter(event => isSameDay(new Date(event.date), date))}
                {...props}
              />
            ),
          }}
        />
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 border-t">
        <CalendarLegend 
          showBookings={true} 
          showEvents={true} 
          showManualEntries={true} 
        />
        
        {selectedDateEvents.length > 0 ? (
          <CalendarDayView 
            selectedDate={selectedDate} 
            events={selectedDateEvents} 
            isSummary={true}
          />
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 mt-3">
            No events for {format(selectedDate, "MMMM d, yyyy")}
          </div>
        )}
      </div>
    </div>
  );
};
