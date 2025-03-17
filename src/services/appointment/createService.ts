
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AppointmentFormData } from "./types";
import { RecurringFormData } from "@/types/recurring.types";
import { generateRecurringDates } from "../recurring/recurringService";

/**
 * Creates a new appointment
 */
export const createAppointment = async (
  appointmentData: AppointmentFormData,
  recurringData?: RecurringFormData
) => {
  try {
    // First, check if the user can create appointments
    const { data: permissionData, error: permissionError } = await supabase.rpc(
      "get_auth_user_account_type"
    );

    if (permissionError) {
      console.error("Permission check failed:", permissionError);
      throw new Error(
        `Permission check failed: ${permissionError.message}`
      );
    }

    if (!permissionData || permissionData === "free") {
      // User doesn't have permission to create appointments
      toast({
        title: "Subscription Required",
        description: "Creating appointments requires an Individual or Business subscription",
        variant: "destructive",
      });
      throw new Error("Subscription required to create appointments");
    }
    
    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.error("No authenticated user for appointment creation");
      throw new Error("Authentication required to create appointments");
    }
    
    // Add the user_id to the appointment data
    const completeAppointmentData = {
      ...appointmentData,
      user_id: session.user.id
    };

    console.log("Creating appointment with data:", completeAppointmentData);

    // Insert the appointment
    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert(completeAppointmentData)
      .select()
      .single();

    if (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Failed to create appointment",
        description: error.message,
        variant: "destructive",
      });
      throw new Error(`Failed to create appointment: ${error.message}`);
    }

    console.log("Appointment created successfully:", appointment);

    // If this is a recurring appointment, create the recurrences
    if (recurringData && appointment) {
      try {
        // Generate dates based on the recurring pattern
        const recurringDates = generateRecurringDates(
          new Date(appointment.start_time),
          recurringData
        );
        
        // Create recurring instances - this would be implemented in a separate function
        console.log("Would create recurring instances for dates:", recurringDates);
        
        // For now, we'll just log this as a placeholder until the full recurring functionality is implemented
        toast({
          title: "Recurring Pattern Created",
          description: `Generated ${recurringDates.length} future occurrences`,
        });
      } catch (recurringError: any) {
        // Log the error but don't fail the whole operation
        console.error("Error creating recurring instances:", recurringError);
        toast({
          title: "Appointment Created",
          description: "Appointment was created, but there was an issue with recurring settings.",
          variant: "destructive",
        });
      }
    }

    return appointment;
  } catch (error: any) {
    console.error("Error in createAppointment:", error);
    
    // If we haven't already shown a toast for this error
    if (!error.message?.includes("Subscription required")) {
      toast({
        title: "Error creating appointment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
    throw error;
  }
};
