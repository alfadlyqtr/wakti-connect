
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarEvent, DayEventTypes } from "@/types/calendar.types";
import CalendarDayCell from "./CalendarDayCell";
import { format, isSameDay } from "date-fns";
import CalendarLegend from "./CalendarLegend";
import { TaskList } from "./TaskList";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DashboardCalendarProps {
  events?: CalendarEvent[];
  isCompact?: boolean;
}

// Fetches both user tasks and bookings as calendar events (no dummy data)
const useRealCalendarEvents = (userId: string | null) => {
  return useQuery({
    queryKey: ['calendarEvents', userId],
    queryFn: async () => {
      if (!userId) return [];
      const results: CalendarEvent[] = [];

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('id, title, due_date, status')
        .eq('user_id', userId)
        .not('due_date', 'is', null);

      if (!tasksError && tasksData) {
        results.push(...tasksData.map(task => ({
          id: task.id,
          title: task.title,
          date: new Date(task.due_date as string),
          type: "task" as const,
          status: task.status
        })));
      }

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
    },
    enabled: !!userId,
  });
};

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  isCompact = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [userId, setUserId] = useState<string | null>(null);

  // Get current userId for filtering
  useEffect(() => {
    supabase.auth.getSession().then(result => {
      const id = result.data?.session?.user?.id;
      setUserId(id || null);
    });
  }, []);

  // Get task and booking events for this user
  const { data: events = [], isLoading } = useRealCalendarEvents(userId);

  // Helper: filter events for specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getEventTypesForDate = (date: Date): DayEventTypes => {
    const dateEvents = getEventsForDate(date);
    return {
      hasTasks: dateEvents.some(event => event.type === "task"),
      hasBookings: dateEvents.some(event => event.type === "booking")
    };
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

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
          <Calendar
            mode="single"
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

          <CalendarLegend showBookings={true} />

          {selectedDateEvents.length > 0 ? (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium">
                  {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                <Badge variant="outline" className="ml-2 bg-white/50 text-xs">
                  {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'event' : 'events'}
                </Badge>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 p-2">
                <TaskList tasks={selectedDateEvents} />
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
              No events for {format(selectedDate, "MMMM d, yyyy")}
            </div>
          )}
        </>
      )}
    </div>
  );
};
