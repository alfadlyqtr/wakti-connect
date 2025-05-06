
import React, { useState } from "react";
import { format, isSameDay, startOfToday } from "date-fns";
import { Card } from "@/components/ui/card";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";
import CalendarDayView from "@/components/calendar/CalendarDayView";
import CalendarEntryDialog from "@/components/calendar/CalendarEntryDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import CalendarLegend from "@/components/calendar/CalendarLegend";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const DashboardCalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const { events, isLoading, refetch } = useCalendarEvents();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    entryId: string;
    entryType: string;
  }>({ isOpen: false, entryId: "", entryType: "" });
  
  // Check if on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Convert CalendarEvent array to format expected by FullScreenCalendar
  const calendarData = React.useMemo(() => {
    // Group events by date
    const eventsByDay = events.reduce<Record<string, any[]>>((acc, event) => {
      const dateStr = format(new Date(event.date), "yyyy-MM-dd");
      
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      
      // Only add a reference to the event type, not the full content
      // This prevents cluttering the calendar cells
      acc[dateStr].push({
        id: event.id,
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
      
      refetch();
      
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    }
  };

  // Handle confirming manual entry deletion
  const confirmDeleteEntry = (entryId: string, entryType: string) => {
    setDeleteConfirmation({
      isOpen: true,
      entryId,
      entryType
    });
  };

  // Handle deleting entries
  const handleDeleteEntry = async (entryId: string, entryType: string) => {
    try {
      let error;
      
      if (entryType === 'manual') {
        // Delete from manual entries table
        const result = await supabase
          .from('calendar_manual_entries')
          .delete()
          .eq('id', entryId);
          
        error = result.error;
      } else if (entryType === 'event') {
        // Delete from events table
        const result = await supabase
          .from('events')
          .delete()
          .eq('id', entryId);
          
        error = result.error;
      } else {
        throw new Error("Only manual entries and events can be deleted");
      }
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Entry deleted",
        description: "The entry has been removed from your calendar",
      });
      
      refetch();
    } catch (err) {
      console.error("Error deleting entry:", err);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the entry",
        variant: "destructive",
      });
    } finally {
      // Close the confirmation dialog
      setDeleteConfirmation({ isOpen: false, entryId: "", entryType: "" });
    }
  };
  
  // Selected day events
  const selectedDayEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );

  return (
    <div className="container mx-auto space-y-4 py-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <CalendarLegend className="ml-auto" />
      </div>
      <Separator className="my-2" />

      {/* Make the calendar section take full width on mobile */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-4`}>
        <Card className={`${isMobile ? 'w-full px-0' : 'col-span-1 lg:col-span-2'} overflow-hidden relative`}>
          <FullScreenCalendar 
            data={calendarData}
            isLoading={isLoading}
            onAddEntry={() => setIsEntryDialogOpen(true)}
            onSelectDay={setSelectedDate}
          />
        </Card>

        <div className={`${isMobile ? 'w-full mt-4' : 'col-span-1'}`}>
          <CalendarDayView 
            date={selectedDate}
            events={selectedDayEvents}
            onCompleteTask={handleCompleteTask}
            onDelete={confirmDeleteEntry}
          />
        </div>
      </div>

      <CalendarEntryDialog 
        open={isEntryDialogOpen}
        onOpenChange={setIsEntryDialogOpen}
        defaultDate={selectedDate}
        onEntryCreated={() => {
          refetch();
          setIsEntryDialogOpen(false);
        }}
      />

      <ConfirmationDialog
        title="Delete Calendar Entry"
        description="Are you sure you want to delete this calendar entry? This action cannot be undone."
        open={deleteConfirmation.isOpen}
        onOpenChange={(open) => setDeleteConfirmation({ ...deleteConfirmation, isOpen: open })}
        onConfirm={() => handleDeleteEntry(deleteConfirmation.entryId, deleteConfirmation.entryType)}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default DashboardCalendarPage;
