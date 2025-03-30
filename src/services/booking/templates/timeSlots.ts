
import { supabase } from "@/integrations/supabase/client";
import { AvailableTimeSlot } from "@/types/booking.types";

// Fetch available time slots for a template on a specific date
export const fetchAvailableTimeSlots = async (
  templateId: string, 
  date: string
): Promise<AvailableTimeSlot[]> => {
  const { data, error } = await supabase
    .rpc('get_template_available_slots', {
      template_id_param: templateId,
      date_param: date
    });

  if (error) {
    console.error("Error fetching available time slots:", error);
    throw error;
  }

  // Transform the data to match the AvailableTimeSlot type by adding is_available property
  return (data || []).map(slot => ({
    start_time: slot.start_time,
    end_time: slot.end_time,
    is_available: true // Since these are available slots, we set is_available to true
  }));
};
