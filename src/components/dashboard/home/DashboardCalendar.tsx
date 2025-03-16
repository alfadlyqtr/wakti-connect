
import React, { useState } from "react";
import { startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";
import DayEventsDialog from "./DayEventsDialog";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCalendarEventUtils } from "@/hooks/useCalendarEventUtils";
import CalendarDayCell from "./CalendarDayCell";
import { DayProps } from "react-day-picker";

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
  const renderDay = (day: DayProps) => {
    // Extract the date from the day props
    const { date } = day;
    
    // Skip rendering if the date is undefined
    if (!date) {
      return <div />;
    }
    
    // Check if this date is selected
    const isSelected = selectedDate && 
      selectedDate.getDate() === date.getDate() && 
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getFullYear() === date.getFullYear();
    
    // Get event types for this date
    const eventTypes = getEventTypesForDate(date);
    
    return (
      <CalendarDayCell
        date={date}
        selected={isSelected}
        eventTypes={eventTypes}
        onSelect={handleDateSelect}
        {...day}
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
