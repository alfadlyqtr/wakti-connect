
import { supabase } from "@/integrations/supabase/client";
import { BookingTemplate, BookingTemplateFormData, BookingTemplateAvailability, BookingTemplateException } from "@/types/booking.types";

// Fetch all booking templates for a business
export const fetchBookingTemplates = async () => {
  const { data, error } = await supabase
    .from('booking_templates')
    .select(`
      *,
      service:service_id (
        name,
        description,
        price
      ),
      staff:staff_assigned_id (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching booking templates:", error);
    throw error;
  }

  return {
    templates: data || [],
    userRole: "business"
  };
};

// Fetch a single booking template by ID
export const fetchBookingTemplate = async (templateId: string) => {
  const { data, error } = await supabase
    .from('booking_templates')
    .select(`
      *,
      service:service_id (
        name,
        description,
        price
      ),
      staff:staff_assigned_id (
        name
      )
    `)
    .eq('id', templateId)
    .single();

  if (error) {
    console.error("Error fetching booking template:", error);
    throw error;
  }

  return data;
};

// Create a new booking template
export const createBookingTemplate = async (templateData: BookingTemplateFormData) => {
  const { data, error } = await supabase
    .from('booking_templates')
    .insert(templateData)
    .select()
    .single();

  if (error) {
    console.error("Error creating booking template:", error);
    throw error;
  }

  return data;
};

// Update an existing booking template
export const updateBookingTemplate = async (templateId: string, templateData: Partial<BookingTemplateFormData>) => {
  const { data, error } = await supabase
    .from('booking_templates')
    .update(templateData)
    .eq('id', templateId)
    .select()
    .single();

  if (error) {
    console.error("Error updating booking template:", error);
    throw error;
  }

  return data;
};

// Delete a booking template
export const deleteBookingTemplate = async (templateId: string) => {
  const { error } = await supabase
    .from('booking_templates')
    .delete()
    .eq('id', templateId);

  if (error) {
    console.error("Error deleting booking template:", error);
    throw error;
  }

  return true;
};

// Fetch availability for a template
export const fetchTemplateAvailability = async (templateId: string) => {
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
export const addTemplateAvailability = async (availability: Omit<BookingTemplateAvailability, 'id' | 'created_at' | 'updated_at'>) => {
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
export const updateTemplateAvailability = async (availabilityId: string, availability: Partial<BookingTemplateAvailability>) => {
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
export const deleteTemplateAvailability = async (availabilityId: string) => {
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

// Fetch exceptions for a template
export const fetchTemplateExceptions = async (templateId: string) => {
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
export const addTemplateException = async (exception: Omit<BookingTemplateException, 'id' | 'created_at' | 'updated_at'>) => {
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
export const deleteTemplateException = async (exceptionId: string) => {
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

// Fetch available time slots for a template on a specific date
export const fetchAvailableTimeSlots = async (templateId: string, date: string) => {
  const { data, error } = await supabase
    .rpc('get_template_available_slots', {
      template_id_param: templateId,
      date_param: date
    });

  if (error) {
    console.error("Error fetching available time slots:", error);
    throw error;
  }

  return data || [];
};

// Add template endpoint to service index file
export const publishTemplate = async (templateId: string, isPublished: boolean) => {
  const { data, error } = await supabase
    .from('booking_templates')
    .update({ is_published: isPublished })
    .eq('id', templateId)
    .select()
    .single();

  if (error) {
    console.error("Error updating template publishing status:", error);
    throw error;
  }

  return data;
};
