
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from '@/types/calendar.types';
import { fetchTasks, fetchEvents } from '@/services/calendar';
import { useQuery } from '@tanstack/react-query';

export function useCalendarEvents() {
  const [userId, setUserId] = useState<string | null>(null);

  // Get current userId for filtering
  useEffect(() => {
    supabase.auth.getSession().then(result => {
      const id = result.data?.session?.user?.id;
      setUserId(id || null);
    });
  }, []);

  const { data: taskEvents = [], isLoading: isLoadingTasks, refetch: refetchTasks } = useQuery({
    queryKey: ['calendarTaskEvents', userId],
    queryFn: async () => userId ? fetchTasks(userId) : [],
    enabled: !!userId,
  });

  const { data: bookingEvents = [], isLoading: isLoadingBookings, refetch: refetchBookings } = useQuery({
    queryKey: ['calendarBookingEvents', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        // Fetch bookings (where user is customer or business)
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('id, title, start_time, status')
          .or(`customer_id.eq.${userId},business_id.eq.${userId}`);

        if (!bookingsData) return [];

        return bookingsData.map(booking => ({
          id: booking.id,
          title: booking.title,
          date: new Date(booking.start_time as string),
          type: "booking" as const,
          status: booking.status
        }));
      } catch (error) {
        console.error("Error fetching booking events:", error);
        return [];
      }
    },
    enabled: !!userId,
  });

  const { data: calendarEvents = [], isLoading: isLoadingEvents, refetch: refetchEvents } = useQuery({
    queryKey: ['calendarEvents', userId],
    queryFn: async () => userId ? fetchEvents(userId) : [],
    enabled: !!userId,
  });

  const { data: manualEvents = [], isLoading: isLoadingManual, refetch: refetchManual } = useQuery({
    queryKey: ['calendarManualEvents', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        // Fetch manual entries
        const { data: manualData } = await supabase
          .from('calendar_manual_entries')
          .select('id, title, description, date, location, start_time, end_time')
          .eq('user_id', userId);

        if (!manualData) return [];

        return manualData.map(entry => ({
          id: entry.id,
          title: entry.title,
          description: entry.description,
          date: new Date(entry.date),
          type: "manual" as const,
          location: entry.location,
          startTime: entry.start_time,
          endTime: entry.end_time
        }));
      } catch (error) {
        console.error("Error fetching manual events:", error);
        return [];
      }
    },
    enabled: !!userId,
  });

  const { data: reminderEvents = [], isLoading: isLoadingReminders, refetch: refetchReminders } = useQuery({
    queryKey: ['calendarReminderEvents', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        // Fetch reminders
        const { data: remindersData } = await supabase
          .from('reminders')
          .select('id, message, reminder_time')
          .eq('user_id', userId)
          .eq('is_active', true);

        if (!remindersData) return [];

        return remindersData.map(reminder => ({
          id: reminder.id,
          title: reminder.message,
          date: new Date(reminder.reminder_time),
          type: "reminder" as const
        }));
      } catch (error) {
        console.error("Error fetching reminder events:", error);
        return [];
      }
    },
    enabled: !!userId,
  });

  const allEvents = [
    ...(taskEvents || []),
    ...(bookingEvents || []),
    ...(calendarEvents || []),
    ...(manualEvents || []),
    ...(reminderEvents || [])
  ];

  const isLoading = isLoadingTasks || isLoadingBookings || isLoadingEvents || 
                   isLoadingManual || isLoadingReminders;

  // Create a combined refetch function that calls all refetch functions
  const refetch = async () => {
    await Promise.all([
      refetchTasks(),
      refetchBookings(),
      refetchEvents(),
      refetchManual(),
      refetchReminders()
    ]);
  };

  return {
    events: allEvents,
    isLoading,
    userId,
    refetch
  };
}
