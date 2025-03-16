
import { useQuery } from "@tanstack/react-query";
import { CalendarEvent } from "@/types/calendar.types";
import { supabase } from "@/integrations/supabase/client";

// Fetch user profile data to get account type
const fetchUserProfile = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("No active session");
  }
  
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', session.user.id)
    .single();
  
  if (profileError) {
    console.error("Error fetching profile data:", profileError);
    throw profileError;
  }
  
  return {
    userId: session.user.id,
    accountType: profileData?.account_type || "free"
  };
};

// Fetch tasks for calendar
const fetchTasks = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('id, title, due_date')
      .eq('user_id', userId)
      .not('due_date', 'is', null);
    
    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      return [];
    }
    
    if (!tasksData || tasksData.length === 0) {
      return [];
    }
    
    return tasksData.map(task => ({
      id: task.id,
      title: task.title,
      date: new Date(task.due_date as string),
      type: 'task' as const
    }));
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    return [];
  }
};

// Fetch appointments created by user
const fetchMyAppointments = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, title, start_time')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching my appointments:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(appointment => ({
      id: appointment.id,
      title: appointment.title,
      date: new Date(appointment.start_time),
      type: 'appointment' as const
    }));
  } catch (error) {
    console.error("Error in fetchMyAppointments:", error);
    return [];
  }
};

// Fetch appointments assigned to user
const fetchAssignedAppointments = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, title, start_time')
      .eq('assignee_id', userId);
    
    if (error) {
      console.error("Error fetching assigned appointments:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(appointment => ({
      id: appointment.id,
      title: appointment.title,
      date: new Date(appointment.start_time),
      type: 'appointment' as const
    }));
  } catch (error) {
    console.error("Error in fetchAssignedAppointments:", error);
    return [];
  }
};

// Fetch appointments user was invited to and accepted
const fetchInvitedAppointments = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('appointment_invitations')
      .select('appointment_id, appointments(id, title, start_time)')
      .eq('invited_user_id', userId)
      .eq('status', 'accepted');
    
    if (error) {
      console.error("Error fetching invited appointments:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data
      .filter(invitation => invitation.appointments !== null)
      .map(invitation => ({
        id: invitation.appointments.id,
        title: invitation.appointments.title,
        date: new Date(invitation.appointments.start_time),
        type: 'appointment' as const
      }));
  } catch (error) {
    console.error("Error in fetchInvitedAppointments:", error);
    return [];
  }
};

// Fetch bookings (for business accounts)
const fetchBookings = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, title, start_time')
      .eq('status', 'scheduled'); // Or use another condition to identify bookings
    
    if (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(booking => ({
      id: booking.id,
      title: booking.title,
      date: new Date(booking.start_time),
      type: 'booking' as const
    }));
  } catch (error) {
    console.error("Error in fetchBookings:", error);
    return [];
  }
};

export const useCalendarEvents = () => {
  return useQuery({
    queryKey: ['calendarEvents'],
    queryFn: async (): Promise<CalendarEvent[]> => {
      try {
        // Fetch user profile first to get account type
        const { userId, accountType } = await fetchUserProfile();
        
        // Initialize empty events array
        let events: CalendarEvent[] = [];
        
        // 1. Fetch tasks (all account types)
        const taskEvents = await fetchTasks(userId);
        events = [...events, ...taskEvents];
        
        // 2. Fetch appointments (individual and business accounts)
        if (accountType === 'individual' || accountType === 'business') {
          // Get my appointments
          const myAppointments = await fetchMyAppointments(userId);
          events = [...events, ...myAppointments];
          
          // Get appointments assigned to me
          const assignedAppointments = await fetchAssignedAppointments(userId);
          events = [...events, ...assignedAppointments];
          
          // Get appointments I'm invited to and accepted
          const invitedAppointments = await fetchInvitedAppointments(userId);
          events = [...events, ...invitedAppointments];
        }
        
        // 3. Fetch bookings (business accounts only)
        if (accountType === 'business') {
          const bookingEvents = await fetchBookings(userId);
          events = [...events, ...bookingEvents];
        }
        
        return events;
      } catch (error) {
        console.error("Error fetching calendar events:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
};
