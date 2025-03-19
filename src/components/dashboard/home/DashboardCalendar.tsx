
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarEvent, DayEventTypes } from "@/types/calendar.types";
import CalendarDayCell from "./CalendarDayCell";
import { format, isSameDay } from "date-fns";
import CalendarLegend from "./CalendarLegend";
import { TaskList } from "./TaskList";

interface DashboardCalendarProps {
  events: CalendarEvent[];
  isCompact?: boolean;
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  events = [],
  isCompact = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Get all events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };
  
  // Get event types for a specific date
  const getEventTypesForDate = (date: Date): DayEventTypes => {
    const dateEvents = getEventsForDate(date);
    
    return {
      hasTasks: dateEvents.some(event => event.type === "task"),
      hasBookings: dateEvents.some(event => event.type === "booking")
    };
  };
  
  // Get events for the selected date
  const selectedDateEvents = getEventsForDate(selectedDate);
  
  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border"
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
          <h3 className="text-sm font-medium mb-2">
            {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          <TaskList tasks={selectedDateEvents} />
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No events scheduled for {format(selectedDate, "MMMM d, yyyy")}
        </div>
      )}
    </div>
  );
};
