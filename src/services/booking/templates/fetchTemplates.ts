
import { supabase } from "@/integrations/supabase/client";
import { BookingTemplate, BookingTemplateWithRelations, BookingTemplatesResult } from "@/types/booking.types";

// Fetch all booking templates for a business
export const fetchBookingTemplates = async (): Promise<BookingTemplatesResult> => {
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
export const fetchBookingTemplate = async (templateId: string): Promise<BookingTemplateWithRelations> => {
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

// Fetch only published booking templates for a business
export const fetchPublishedBookingTemplates = async (businessId: string): Promise<BookingTemplateWithRelations[]> => {
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
    .eq('business_id', businessId)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching published booking templates:", error);
    throw error;
  }

  return data || [];
};
