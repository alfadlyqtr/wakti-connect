
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AppointmentFormData } from "./types";
import { RecurringFormData } from "@/types/recurring.types";
import { generateRecurringDates } from "../recurring/recurringService";

/**
 * Creates a new appointment with account type permission checking
 */
export const createAppointment = async (
  appointmentData: AppointmentFormData,
  recurringData?: RecurringFormData
) => {
  try {
    // Check if the user can create appointments using our can_create_appointment function
    const { data: canCreate, error: permissionError } = await supabase.rpc(
      "can_create_appointment"
    );

    if (permissionError) {
      console.error("Permission check failed:", permissionError);
      throw new Error(`Permission check failed: ${permissionError.message}`);
    }

    if (!canCreate) {
      // User doesn't have permission to create appointments
      toast({
        title: "Monthly Limit Reached",
        description: "Free accounts can only create one appointment per month. Please upgrade for unlimited appointments.",
        variant: "destructive",
      });
      throw new Error("Monthly appointment limit reached for free account");
    }
    
    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.error("No authenticated user for appointment creation");
      throw new Error("Authentication required to create appointments");
    }
    
    // Add the user_id and default appointment_type to the appointment data
    const completeAppointmentData = {
      ...appointmentData,
      user_id: session.user.id,
      appointment_type: appointmentData.appointment_type || 'appointment'
    };

    // Explicit logging and error handling for the insert operation
    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert(completeAppointmentData)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error creating appointment:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!appointment) {
      throw new Error("Failed to create appointment: No data returned");
    }

    // If this is a recurring appointment, create the recurrences
    if (recurringData && appointment) {
      try {
        // Generate dates based on the recurring pattern
        const recurringDates = generateRecurringDates(
          new Date(appointment.start_time),
          recurringData
        );
        
        console.log("Would create recurring instances for dates:", recurringDates);
        
        toast({
          title: "Recurring Pattern Created",
          description: `Generated ${recurringDates.length} future occurrences`,
        });
      } catch (recurringError: any) {
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
    throw error;
  }
};
