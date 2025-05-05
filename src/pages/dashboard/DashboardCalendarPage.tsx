
import React, { useState, useEffect } from "react";
import { format, isSameDay, startOfToday } from "date-fns";
import { Card } from "@/components/ui/card";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";
import CalendarDayView from "@/components/calendar/CalendarDayView";
import CalendarEntryDialog from "@/components/calendar/CalendarEntryDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const DashboardCalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const { events, isLoading } = useCalendarEvents();
  
  // Convert CalendarEvent array to format expected by FullScreenCalendar
  const calendarData = React.useMemo(() => {
    // Group events by date
    const eventsByDay = events.reduce<Record<string, any[]>>((acc, event) => {
      const dateStr = format(new Date(event.date), "yyyy-MM-dd");
      
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      
      acc[dateStr].push({
        id: event.id,
        name: event.title,
        time: event.startTime,
        type: event.type,
      });
      
      return acc;
    }, {});
    
    // Convert to array format expected by calendar
    return Object.entries(eventsByDay).map(([dateStr, events]) => ({
      day: new Date(dateStr),
      events,
    }));
  }, [events]);
  
  // Handle completing task
  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ 
          status: "completed",
          completed_at: new Date().toISOString()
        })
        .eq("id", taskId);
      
      if (error) throw error;
      
      toast({
        title: "Task completed",
        description: "Your task has been marked as complete",
      });
      
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    }
  };
  
  // Selected day events
  const selectedDayEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );

  return (
    <div className="container mx-auto space-y-4 py-2">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <Separator className="my-2" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-1 lg:col-span-2 overflow-hidden relative">
          <FullScreenCalendar 
            data={calendarData}
            isLoading={isLoading}
            onAddEntry={() => setIsEntryDialogOpen(true)}
            onSelectDay={setSelectedDate}
          />
        </Card>

        <div className="col-span-1">
          <CalendarDayView 
            date={selectedDate}
            events={selectedDayEvents}
            onCompleteTask={handleCompleteTask}
          />
        </div>
      </div>

      <CalendarEntryDialog 
        open={isEntryDialogOpen}
        onOpenChange={setIsEntryDialogOpen}
        defaultDate={selectedDate}
        onEntryCreated={() => {
          // Force refetch of calendar data
          window.location.reload();
        }}
      />
    </div>
  );
};

export default DashboardCalendarPage;
