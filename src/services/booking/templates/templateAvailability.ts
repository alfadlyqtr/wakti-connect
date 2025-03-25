
import { supabase } from "@/integrations/supabase/client";
import { BookingTemplateAvailability } from "@/types/booking.types";

// Fetch availability for a template
export const fetchTemplateAvailability = async (templateId: string): Promise<BookingTemplateAvailability[]> => {
  const { data, error } = await supabase
    .from('booking_template_availability')
    .select('*')
    .eq('template_id', templateId)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Error fetching template availability:", error);
    throw error;
  }

  return data || [];
};

// Add availability to a template
export const addTemplateAvailability = async (
  availability: Omit<BookingTemplateAvailability, 'id' | 'created_at' | 'updated_at'>
): Promise<BookingTemplateAvailability> => {
  const { data, error } = await supabase
    .from('booking_template_availability')
    .insert(availability)
    .select()
    .single();

  if (error) {
    console.error("Error adding template availability:", error);
    throw error;
  }

  return data;
};

// Update template availability
export const updateTemplateAvailability = async (
  availabilityId: string, 
  availability: Partial<BookingTemplateAvailability>
): Promise<BookingTemplateAvailability> => {
  const { data, error } = await supabase
    .from('booking_template_availability')
    .update(availability)
    .eq('id', availabilityId)
    .select()
    .single();

  if (error) {
    console.error("Error updating template availability:", error);
    throw error;
  }

  return data;
};

// Delete template availability
export const deleteTemplateAvailability = async (availabilityId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('booking_template_availability')
    .delete()
    .eq('id', availabilityId);

  if (error) {
    console.error("Error deleting template availability:", error);
    throw error;
  }

  return true;
};
