
import { supabase } from "@/integrations/supabase/client";
import { BookingTemplateFormData, BookingTemplate } from "@/types/booking.types";

// Create a new booking template
export const createBookingTemplate = async (templateData: BookingTemplateFormData): Promise<BookingTemplate> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated to create templates");
  }

  // Create template with single staff if provided
  const templateToCreate = {
    ...templateData,
    business_id: user.id,
    // If we have staff_assigned_ids, use the first one for the main staff_assigned_id
    staff_assigned_id: templateData.staff_assigned_ids && templateData.staff_assigned_ids.length > 0 
      ? templateData.staff_assigned_ids[0] 
      : null
  };
  
  // Remove the staff_assigned_ids property as it's not in the table schema
  delete templateToCreate.staff_assigned_ids;

  // Insert the template
  const { data, error } = await supabase
    .from('booking_templates')
    .insert(templateToCreate)
    .select()
    .single();

  if (error) {
    console.error("Error creating booking template:", error);
    throw error;
  }

  // If we have additional staff to assign beyond the first one
  if (templateData.staff_assigned_ids && templateData.staff_assigned_ids.length > 1) {
    // Handle additional staff assignments via a future staff-template relationship table
    console.log("Multiple staff assignments not yet implemented in database schema");
    // This is where you would add code to store additional staff in a relationship table
  }

  return data;
};

// Update an existing booking template
export const updateBookingTemplate = async (templateId: string, templateData: Partial<BookingTemplateFormData>): Promise<BookingTemplate> => {
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
export const deleteBookingTemplate = async (templateId: string): Promise<boolean> => {
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

// Publish template endpoint
export const publishTemplate = async (templateId: string, isPublished: boolean): Promise<BookingTemplate> => {
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
