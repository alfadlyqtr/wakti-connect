
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

  const { data: taskEvents = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['calendarTaskEvents', userId],
    queryFn: async () => userId ? fetchTasks(userId) : [],
    enabled: !!userId,
  });

  const { data: bookingEvents = [], isLoading: isLoadingBookings } = useQuery({
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

  const { data: calendarEvents = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['calendarEvents', userId],
    queryFn: async () => userId ? fetchEvents(userId) : [],
    enabled: !!userId,
  });

  const allEvents = [
    ...(taskEvents || []),
    ...(bookingEvents || []),
    ...(calendarEvents || [])
  ];

  const isLoading = isLoadingTasks || isLoadingBookings || isLoadingEvents;

  return {
    events: allEvents,
    isLoading,
    userId
  };
}
