
import { useQuery } from "@tanstack/react-query";
import { CalendarEvent } from "@/types/calendar.types";
import { supabase } from "@/integrations/supabase/client";

export const useCalendarEvents = () => {
  return useQuery({
    queryKey: ['calendarEvents'],
    queryFn: async (): Promise<CalendarEvent[]> => {
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
};
