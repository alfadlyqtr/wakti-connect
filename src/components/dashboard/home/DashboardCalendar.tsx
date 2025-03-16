
import React, { useState } from "react";
import { format, startOfToday, isEqual, isSameMonth, isToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DayEventsDialog from "./DayEventsDialog";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "task" | "appointment" | "booking";
}

// Component to show a dot indicator for a specific event type
const EventDot = ({ type }: { type: "task" | "appointment" | "booking" }) => {
  const colorClass = 
    type === "task" 
      ? "bg-amber-500" 
      : type === "appointment" 
        ? "bg-blue-500" 
        : "bg-green-500";
  
  return <span className={`h-1.5 w-1.5 rounded-full ${colorClass}`} />;
};

export function DashboardCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startOfToday());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch calendar events (tasks, appointments, bookings)
  const { data: calendarEvents, isLoading } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Get user's account type
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile data:", profileError);
        throw profileError;
      }
      
      const userRole = profileData?.account_type || "free";
      
      // Start with empty events array
      let events: CalendarEvent[] = [];
      
      try {
        // 1. Fetch tasks (all account types)
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('id, title, due_date')
          .eq('user_id', session.user.id)
          .not('due_date', 'is', null);
        
        if (tasksError) {
          console.error("Error fetching tasks:", tasksError);
        } else if (tasksData) {
          const taskEvents = tasksData.map(task => ({
            id: task.id,
            title: task.title,
            date: new Date(task.due_date as string),
            type: 'task' as const
          }));
          events = [...events, ...taskEvents];
        }
        
        // 2. Fetch appointments (individual and business accounts)
        if (userRole === 'individual' || userRole === 'business') {
          // Get my appointments
          const { data: myAppointmentsData, error: myAppointmentsError } = await supabase
            .from('appointments')
            .select('id, title, start_time')
            .eq('user_id', session.user.id);
          
          if (myAppointmentsError) {
            console.error("Error fetching my appointments:", myAppointmentsError);
          } else if (myAppointmentsData) {
            const appointmentEvents = myAppointmentsData.map(appointment => ({
              id: appointment.id,
              title: appointment.title,
              date: new Date(appointment.start_time),
              type: 'appointment' as const
            }));
            events = [...events, ...appointmentEvents];
          }
          
          // Get appointments assigned to me
          const { data: assignedAppointmentsData, error: assignedAppointmentsError } = await supabase
            .from('appointments')
            .select('id, title, start_time')
            .eq('assignee_id', session.user.id);
          
          if (assignedAppointmentsError) {
            console.error("Error fetching assigned appointments:", assignedAppointmentsError);
          } else if (assignedAppointmentsData) {
            const assignedEvents = assignedAppointmentsData.map(appointment => ({
              id: appointment.id,
              title: appointment.title,
              date: new Date(appointment.start_time),
              type: 'appointment' as const
            }));
            events = [...events, ...assignedEvents];
          }
          
          // Get appointments I'm invited to and accepted
          const { data: invitedAppointmentsData, error: invitedAppointmentsError } = await supabase
            .from('appointment_invitations')
            .select('appointment_id, appointments(id, title, start_time)')
            .eq('invited_user_id', session.user.id)
            .eq('status', 'accepted');
          
          if (invitedAppointmentsError) {
            console.error("Error fetching invited appointments:", invitedAppointmentsError);
          } else if (invitedAppointmentsData) {
            const invitedEvents = invitedAppointmentsData
              .filter(invitation => invitation.appointments !== null)
              .map(invitation => ({
                id: invitation.appointments.id,
                title: invitation.appointments.title,
                date: new Date(invitation.appointments.start_time),
                type: 'appointment' as const
              }));
            events = [...events, ...invitedEvents];
          }
        }
        
        // 3. Fetch bookings (business accounts only)
        if (userRole === 'business') {
          // For business accounts, we'll consider bookings as a special type of appointment
          // where the business is providing a service
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('appointments')
            .select('id, title, start_time')
            .eq('status', 'scheduled'); // Or use another condition to identify bookings
          
          if (bookingsError) {
            console.error("Error fetching bookings:", bookingsError);
          } else if (bookingsData) {
            const bookingEvents = bookingsData.map(booking => ({
              id: booking.id,
              title: booking.title,
              date: new Date(booking.start_time),
              type: 'booking' as const
            }));
            events = [...events, ...bookingEvents];
          }
        }
      } catch (error) {
        console.error("Error fetching calendar events:", error);
        throw error;
      }
      
      return events;
    },
    refetchOnWindowFocus: false,
  });
  
  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    if (!calendarEvents) return [];
    
    return calendarEvents.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Function to check if a date has events
  const dateHasEvents = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };
  
  // Function to check what type of events a date has
  const getEventTypesForDate = (date: Date) => {
    const events = getEventsForDate(date);
    return {
      hasTasks: events.some(event => event.type === 'task'),
      hasAppointments: events.some(event => event.type === 'appointment'),
      hasBookings: events.some(event => event.type === 'booking')
    };
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsDialogOpen(true);
    }
  };

  // Custom day renderer for the calendar
  const renderDay = (props: React.HTMLAttributes<HTMLDivElement> & { date: Date; selected?: boolean }) => {
    const { date, selected, ...dayProps } = props;
    const eventTypes = getEventTypesForDate(date);
    
    return (
      <div 
        {...dayProps}
        onClick={(e) => {
          dayProps.onClick?.(e);
          handleDateSelect(date);
        }}
        className={cn(
          dayProps.className,
          "relative group hover:bg-muted cursor-pointer transition-colors",
          selected && "bg-primary text-primary-foreground",
          !isSameMonth(date, new Date()) && "text-muted-foreground opacity-50",
          isToday(date) && !selected && "border border-primary",
        )}
      >
        <time dateTime={format(date, 'yyyy-MM-dd')}>{format(date, 'd')}</time>
        
        {/* Event indicators */}
        {dateHasEvents(date) && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
            {eventTypes.hasTasks && <EventDot type="task" />}
            {eventTypes.hasAppointments && <EventDot type="appointment" />}
            {eventTypes.hasBookings && <EventDot type="booking" />}
          </div>
        )}
      </div>
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
