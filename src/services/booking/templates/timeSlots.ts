
import { supabase } from '@/integrations/supabase/client';
import { AvailableTimeSlot } from '@/types/booking.types';
import { format, parse, addMinutes } from 'date-fns';

/**
 * Fetch available time slots for a booking template on a specific date
 */
export const fetchAvailableTimeSlots = async (
  templateId: string,
  date: string
): Promise<AvailableTimeSlot[]> => {
  try {
    // Get template details
    const { data: template, error: templateError } = await supabase
      .from('booking_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError) throw templateError;
    if (!template) throw new Error('Template not found');

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = new Date(date).getDay();
    
    // Check if this date is an exception (unavailable date)
    const { data: exceptions, error: exceptionsError } = await supabase
      .from('booking_template_exceptions')
      .select('*')
      .eq('template_id', templateId)
      .eq('exception_date', date)
      .eq('is_available', false);
      
    if (exceptionsError) throw exceptionsError;
    
    // If this date is marked as an exception, return empty slots
    if (exceptions && exceptions.length > 0) {
      return [];
    }
    
    // Get availability for this day of week
    const { data: availability, error: availabilityError } = await supabase
      .from('booking_template_availability')
      .select('*')
      .eq('template_id', templateId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_available', true);
      
    if (availabilityError) throw availabilityError;
    
    // If no availability is defined for this day, use default hours
    if (!availability || availability.length === 0) {
      return generateDefaultSlots(template.default_starting_hour, template.default_ending_hour, template.duration, date);
    }
    
    // Convert availability to slots
    const slots: AvailableTimeSlot[] = [];
    
    availability.forEach(slot => {
      const slotStart = parse(slot.start_time, 'HH:mm:ss', new Date(date));
      const slotEnd = parse(slot.end_time, 'HH:mm:ss', new Date(date));
      
      // Generate slots at intervals equal to template duration
      let currentSlotStart = slotStart;
      while (addMinutes(currentSlotStart, template.duration) <= slotEnd) {
        slots.push({
          start_time: format(currentSlotStart, 'HH:mm:ss'),
          end_time: format(addMinutes(currentSlotStart, template.duration), 'HH:mm:ss'),
          is_available: true
        });
        
        currentSlotStart = addMinutes(currentSlotStart, template.duration);
      }
    });
    
    return slots;
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }
};

/**
 * Generate default time slots based on template settings
 */
const generateDefaultSlots = (
  startHour: number,
  endHour: number,
  durationMinutes: number,
  date: string
): AvailableTimeSlot[] => {
  const slots: AvailableTimeSlot[] = [];
  const baseDate = new Date(date);
  
  // Set start and end times
  const startTime = new Date(baseDate);
  startTime.setHours(startHour, 0, 0, 0);
  
  const endTime = new Date(baseDate);
  endTime.setHours(endHour, 0, 0, 0);
  
  // Generate slots at intervals equal to template duration
  let currentSlotStart = startTime;
  while (addMinutes(currentSlotStart, durationMinutes) <= endTime) {
    slots.push({
      start_time: format(currentSlotStart, 'HH:mm:ss'),
      end_time: format(addMinutes(currentSlotStart, durationMinutes), 'HH:mm:ss'),
      is_available: true
    });
    
    currentSlotStart = addMinutes(currentSlotStart, durationMinutes);
  }
  
  return slots;
};
