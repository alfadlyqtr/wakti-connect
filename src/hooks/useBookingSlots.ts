
import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';

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
      setError(null);
      
      try {
        // For now, just create dummy slots
        // In production, this would fetch from the backend
        const dummySlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'];
        setSlots(dummySlots);
      } catch (err) {
        console.error('Error fetching booking slots:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch booking slots'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [templateId, date]);

  return { slots, isLoading, error };
};
