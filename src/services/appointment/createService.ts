
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
    
    // Check user's permission to create appointments using the security definer function
    const { data: canCreate, error: permissionError } = await supabase
      .rpc('can_create_appointments', { user_uid: session.user.id });
    
    if (permissionError) {
      console.error("Error checking permission to create appointments:", permissionError);
      throw new Error("Unable to verify account permissions");
    }
    
    if (!canCreate) {
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
    
    // Insert appointment with retry logic
    let retries = 0;
    const maxRetries = 3;
    let data = null;
    let error = null;
    
    while (retries < maxRetries) {
      try {
        const result = await supabase
          .from('appointments')
          .insert(appointmentData)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
        
        if (error) {
          console.error(`Attempt ${retries + 1} - Error inserting appointment:`, error);
          retries++;
          
          if (retries >= maxRetries) {
            throw error;
          }
          
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        } else {
          // Success, exit the retry loop
          break;
        }
      } catch (e) {
        console.error(`Unexpected error in createAppointment:`, e);
        throw e;
      }
    }
    
    if (error) {
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
      } catch (recurringError: any) {
        console.error("Error creating recurring settings:", recurringError);
        // Don't fail the whole operation if just the recurring part fails
        toast({
          title: "Warning",
          description: "Appointment created but recurring settings couldn't be applied",
          variant: "destructive", // Changed from "warning" to "destructive"
        });
      }
    }
    
    return data;
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    
    // Handle specific error messages
    if (error.message === "This feature is only available for paid accounts") {
      // This is already handled with a toast earlier
    } else if (error.message?.includes("violates row-level security policy")) {
      toast({
        title: "Permission Error",
        description: "You don't have permission to create appointments. Please check your account type.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Failed to create appointment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    throw error;
  }
}
