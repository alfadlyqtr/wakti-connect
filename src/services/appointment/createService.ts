
import { supabase } from "@/integrations/supabase/client";
import { AppointmentFormData } from "../appointment/types";
import { RecurringFormData } from "@/types/recurring.types";
import { createRecurringSetting } from "../recurring/recurringService";

/**
 * Create a new appointment
 */
export async function createAppointment(formData: AppointmentFormData, recurringData?: RecurringFormData) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // Prepare appointment data
    const appointmentData = {
      user_id: session.user.id,
      title: formData.title,
      description: formData.description || null,
      location: formData.location || null,
      start_time: formData.start_time,
      end_time: formData.end_time,
      is_all_day: formData.is_all_day || false,
      status: formData.status || "scheduled",
      assignee_id: formData.assignee_id || null
    };
    
    // Insert appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Handle recurring settings if provided
    if (recurringData && data) {
      await createRecurringSetting({
        entity_id: data.id,
        entity_type: 'appointment',
        created_by: session.user.id,
        frequency: recurringData.frequency,
        interval: recurringData.interval || 1,
        days_of_week: recurringData.days_of_week,
        day_of_month: recurringData.day_of_month,
        end_date: recurringData.end_date,
        max_occurrences: recurringData.max_occurrences
      });
    }
    
    return data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}
