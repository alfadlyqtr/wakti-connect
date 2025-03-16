
import React, { useState } from "react";
import { startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";
import DayEventsDialog from "./DayEventsDialog";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCalendarEventUtils } from "@/hooks/useCalendarEventUtils";
import CalendarDayCell from "./CalendarDayCell";

export function DashboardCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfToday());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch calendar events (tasks, appointments, bookings)
  const { data: calendarEvents, isLoading } = useCalendarEvents();
  
  // Get event utilities
  const { getEventsForDate, getEventTypesForDate } = useCalendarEventUtils(calendarEvents);
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsDialogOpen(true);
    }
  };

  // Custom day renderer for the calendar
  const renderDay = (day: Date, selectedDays: Date[], dayProps: React.HTMLAttributes<HTMLDivElement>) => {
    const eventTypes = getEventTypesForDate(day);
    const isSelected = selectedDays.some(selectedDay => 
      selectedDay.getDate() === day.getDate() && 
      selectedDay.getMonth() === day.getMonth() &&
      selectedDay.getFullYear() === day.getFullYear()
    );
    
    return (
      <CalendarDayCell
        date={day}
        selected={isSelected}
        eventTypes={eventTypes}
        onSelect={handleDateSelect}
        {...dayProps}
      />
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="border rounded-md p-3 w-full pointer-events-auto"
        components={{
          Day: renderDay
        }}
      />
      
      {/* Dialog for showing events on selected date */}
      {selectedDate && (
        <DayEventsDialog
          date={selectedDate}
          events={getEventsForDate(selectedDate)}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}
