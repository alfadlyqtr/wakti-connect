
import { useState, useEffect } from 'react';
import { format, addMinutes } from 'date-fns';
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
        
        // If no slots were returned but we have a template, generate some demo slots
        // This is for preview purposes if template doesn't have availability set
        if (timeSlots.length === 0) {
          const demoSlots = generateDemoTimeSlots(date);
          setSlots(demoSlots);
        } else {
          setSlots(timeSlots);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching booking slots:', err);
        
        // Fallback to demo slots on error
        const demoSlots = generateDemoTimeSlots(date);
        setSlots(demoSlots);
        
        setError(err instanceof Error ? err : new Error('Failed to load booking slots'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [templateId, date]);

  return { slots, isLoading, error };
};

// Helper function to generate demo time slots
const generateDemoTimeSlots = (date: Date): string[] => {
  // Start at 9 AM
  const startHour = 9;
  const startTime = new Date(date);
  startTime.setHours(startHour, 0, 0, 0);
  
  // Generate slots at 30 minute intervals until 5 PM
  const slots: string[] = [];
  const endTime = new Date(date);
  endTime.setHours(17, 0, 0, 0);
  
  let currentTime = startTime;
  while (currentTime < endTime) {
    slots.push(format(currentTime, 'h:mm a'));
    currentTime = addMinutes(currentTime, 30);
  }
  
  return slots;
};
