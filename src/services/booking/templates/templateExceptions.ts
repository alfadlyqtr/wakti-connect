
import { supabase } from "@/integrations/supabase/client";
import { BookingTemplateException } from "@/types/booking.types";

// Fetch exceptions for a template
export const fetchTemplateExceptions = async (templateId: string): Promise<BookingTemplateException[]> => {
  const { data, error } = await supabase
    .from('booking_template_exceptions')
    .select('*')
    .eq('template_id', templateId)
    .order('exception_date', { ascending: true });

  if (error) {
    console.error("Error fetching template exceptions:", error);
    throw error;
  }

  return data || [];
};

// Add exception to a template
export const addTemplateException = async (
  exception: Omit<BookingTemplateException, 'id' | 'created_at' | 'updated_at'>
): Promise<BookingTemplateException> => {
  const { data, error } = await supabase
    .from('booking_template_exceptions')
    .insert(exception)
    .select()
    .single();

  if (error) {
    console.error("Error adding template exception:", error);
    throw error;
  }

  return data;
};

// Delete template exception
export const deleteTemplateException = async (exceptionId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('booking_template_exceptions')
    .delete()
    .eq('id', exceptionId);

  if (error) {
    console.error("Error deleting template exception:", error);
    throw error;
  }

  return true;
};
