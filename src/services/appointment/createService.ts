
import { supabase } from "@/integrations/supabase/client";
import { AppointmentFormData } from "../appointment/types";
import { RecurringFormData } from "@/types/recurring.types";
import { createRecurringSetting } from "../recurring/recurringService";
import { toast } from "@/components/ui/use-toast";

/**
 * Create a new appointment
 */
export async function createAppointment(formData: AppointmentFormData, recurringData?: RecurringFormData) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // Check user's account type
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error checking user account type:", profileError);
      throw new Error("Unable to verify account permissions");
    }
    
    // Only allow paid accounts to create appointments
    if (!profileData || profileData.account_type === 'free') {
      toast({
        title: "Premium Feature",
        description: "Creating appointments is only available for paid accounts. Please upgrade your plan.",
        variant: "destructive",
      });
      throw new Error("This feature is only available for paid accounts");
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
    
    // Log the data being inserted
    console.log("Creating appointment with data:", appointmentData);
    
    // Insert appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();
    
    if (error) {
      console.error("Error inserting appointment:", error);
      throw new Error(error.message || "Failed to create appointment");
    }
    
    if (!data) {
      throw new Error("No data returned after creating appointment");
    }
    
    // Handle recurring settings if provided
    if (recurringData && data) {
      try {
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
      } catch (recurringError) {
        console.error("Error creating recurring settings:", recurringError);
        // Don't fail the whole operation if just the recurring part fails
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}
