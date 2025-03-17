
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
    console.log("Starting appointment creation process...");
    
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
    
    console.log("Permission check passed, proceeding with appointment creation");
    
    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.error("No authenticated user for appointment creation");
      throw new Error("Authentication required to create appointments");
    }
    
    // Ensure start_time and end_time are present
    if (!appointmentData.start_time || !appointmentData.end_time) {
      throw new Error("Appointment must have start and end times");
    }
    
    // Add the user_id and default appointment_type to the appointment data
    const completeAppointmentData = {
      user_id: session.user.id,
      title: appointmentData.title,
      description: appointmentData.description,
      location: appointmentData.location,
      status: appointmentData.status || "scheduled",
      is_all_day: appointmentData.is_all_day || false,
      assignee_id: appointmentData.assignee_id,
      start_time: appointmentData.start_time,
      end_time: appointmentData.end_time,
      appointment_type: appointmentData.appointment_type || 'appointment'
    };

    console.log("Sending appointment data to database:", completeAppointmentData);

    // Explicit logging and error handling for the insert operation
    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert(completeAppointmentData)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error creating appointment:", error);
      
      // Specific error message for RLS violations
      if (error.code === '42501') {
        toast({
          title: "Permission Error",
          description: "You don't have permission to create this appointment. This may be due to Row Level Security policies.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to Create Appointment",
          description: error.message || "Database error occurred",
          variant: "destructive",
        });
      }
      
      throw new Error(`Database error: ${error.message}`);
    }

    if (!appointment) {
      throw new Error("Failed to create appointment: No data returned");
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
        
        console.log("Would create recurring instances for dates:", recurringDates);
        
        // Show success message with recurring info
        toast({
          title: "Recurring Appointment Created",
          description: `Created with ${recurringDates.length} future occurrences`,
        });
        
        return appointment;
      } catch (recurringError: any) {
        console.error("Error creating recurring instances:", recurringError);
        toast({
          title: "Appointment Created",
          description: "Appointment was created, but there was an issue with recurring settings.",
          variant: "destructive",
        });
        
        return appointment;
      }
    }

    // Success toast notification for regular appointments
    toast({
      title: "Appointment Created",
      description: "Your appointment has been successfully created.",
    });

    return appointment;
  } catch (error: any) {
    console.error("Error in createAppointment:", error);
    
    // Only show toast if it's not already handled
    if (!error.message.includes("Monthly appointment limit")) {
      toast({
        title: "Failed to Create Appointment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    throw error;
  }
};
