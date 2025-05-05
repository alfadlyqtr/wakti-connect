
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CalendarEvent, DayEventTypes } from "@/types/calendar.types";
import CalendarEventList from "@/components/calendar/CalendarEventList";
import CalendarDayCell from "@/components/dashboard/home/CalendarDayCell";
import CalendarLegend from "@/components/dashboard/home/CalendarLegend";
import CalendarEntryDialog from './CalendarEntryDialog';
import { useQuery } from '@tanstack/react-query';
import { fetchManualEntries } from '@/services/calendar/manualEntryService';
import { supabase } from '@/integrations/supabase/client';

const EnhancedCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Get current userId
  useEffect(() => {
    supabase.auth.getSession().then(result => {
      const id = result.data?.session?.user?.id;
      setUserId(id || null);
    });
  }, []);

  // Fetch manual calendar entries
  const { data: manualEntries = [], isLoading: isLoadingManual } = useQuery({
    queryKey: ['manualEntries', userId],
    queryFn: () => userId ? fetchManualEntries(userId) : Promise.resolve([]),
    enabled: !!userId,
  });

  // Update events when manual entries are loaded
  useEffect(() => {
    if (manualEntries && manualEntries.length > 0) {
      setEvents(manualEntries);
    }
  }, [manualEntries]);

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

  // Handle new entry creation
  const handleAddEntry = (entry: any) => {
    setEvents((prev) => [...prev, entry]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          Add Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <div className="lg:col-span-7">
          <Card className="border bg-white shadow-sm">
            <CardContent className="p-2 sm:p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full rounded-md border-0 bg-white"
                classNames={{
                  month: "space-y-4",
                  caption_label: "text-base font-semibold",
                  table: "w-full border-collapse",
                  head_row: "flex w-full",
                  head_cell: "w-full text-muted-foreground rounded-md font-normal text-sm px-0",
                  row: "flex w-full mt-2",
                  cell: "h-20 w-full text-center text-sm relative p-0 border-0 focus-within:relative focus-within:z-20",
                  day: "h-full w-full p-1 flex flex-col hover:bg-accent rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_hidden: "invisible",
                }}
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
        </div>
      </div>

      <CalendarLegend showManualEntries={true} />

      {getEventsForDate(selectedDate).length > 0 ? (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {format(selectedDate, "MMMM d, yyyy")}
              </h2>
            </div>
            <CalendarEventList events={getEventsForDate(selectedDate)} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No events for {format(selectedDate, "MMMM d, yyyy")}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus size={16} className="mr-2" />
              Add an entry
            </Button>
          </CardContent>
        </Card>
      )}

      {userId && (
        <CalendarEntryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleAddEntry}
          selectedDate={selectedDate}
          userId={userId}
        />
      )}
    </div>
  );
};

export default EnhancedCalendar;
