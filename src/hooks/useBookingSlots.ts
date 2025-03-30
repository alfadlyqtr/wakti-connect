
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fetchAvailableTimeSlots } from '@/services/booking/templates/timeSlots';

/**
 * Hook to fetch available booking slots for a template
 */
export const useBookingSlots = (templateId: string, date?: Date) => {
  const [slots, setSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!templateId || !date) {
      setSlots([]);
      return;
    }

    const fetchAvailableSlots = async () => {
      setIsLoading(true);
      try {
        // Format date for API request
        const formattedDate = format(date, 'yyyy-MM-dd');
        
        // Fetch available time slots
        const availableSlots = await fetchAvailableTimeSlots(templateId, formattedDate);
        
        // Extract just the start times and format them
        const timeSlots = availableSlots.map(slot => 
          format(new Date(`${formattedDate}T${slot.start_time}`), 'h:mm a')
        );
        
        setSlots(timeSlots);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking slots:', err);
        setError(err instanceof Error ? err : new Error('Failed to load booking slots'));
        setSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [templateId, date]);

  return { slots, isLoading, error };
};
