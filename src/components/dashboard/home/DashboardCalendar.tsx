
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CalendarEvent } from "@/types/calendar.types";
import { isSameDay } from "date-fns";
import { TaskList } from "./TaskList";

interface DashboardCalendarProps {
  events: CalendarEvent[];
  isCompact?: boolean;
}

export function DashboardCalendar({ events, isCompact = false }: DashboardCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  // Helper to check if a date has events
  const hasEventsOnDate = (date: Date) => {
    return events.some(event => isSameDay(new Date(event.date), date));
  };

  // Filter events for selected date
  const getEventsForSelectedDate = (): CalendarEvent[] => {
    if (!selectedDate) return [];
    return events.filter(event => isSameDay(new Date(event.date), selectedDate));
  };

  // Create an object grouped by type for the selected date
  const groupedEvents = {
    tasks: getEventsForSelectedDate().filter(event => event.type === "task")
  };

  // Function to render the day content with badges for events
  const renderDayContent = (day: Date) => {
    const eventsOnDay = hasEventsOnDate(day);

    if (eventsOnDay) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <Badge variant="outline" className="absolute bottom-0 w-1 h-1 rounded-full bg-primary" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="border rounded-md"
        components={{
          DayContent: (props) => (
            <>
              {props.children}
              {renderDayContent(props.date)}
            </>
          ),
        }}
      />

      <div className="mt-4 space-y-4">
        {selectedDate && getEventsForSelectedDate().length > 0 ? (
          <>
            {groupedEvents.tasks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Tasks</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/dashboard/tasks')}
                  >
                    View All
                  </Button>
                </div>
                <TaskList tasks={groupedEvents.tasks} />
              </div>
            )}
          </>
        ) : (
          selectedDate && (
            <div className="text-center py-4 text-muted-foreground">
              No events scheduled for this day
            </div>
          )
        )}
      </div>
    </div>
  );
}
