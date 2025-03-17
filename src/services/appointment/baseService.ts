
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AppointmentFormData, AppointmentStatus } from "./types";

/**
 * Basic appointment creation function without permission checks
 * Used primarily by other services that need to create appointments
 */
export const createNewAppointment = async (appointmentData: AppointmentFormData) => {
  try {
    // Get the current user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      throw new Error("User must be logged in to create appointments");
    }
    
    // Ensure we have the required fields
    if (!appointmentData.title) {
      throw new Error("Appointment title is required");
    }
    
    if (!appointmentData.start_time || !appointmentData.end_time) {
      throw new Error("Appointment must have start and end times");
    }
    
    // Prepare the appointment data - ensure all required fields are present
    // and properly typed for the database
    const completeAppointmentData = {
      user_id: session.user.id,
      title: appointmentData.title,
      description: appointmentData.description || null,
      location: appointmentData.location || null,
      start_time: appointmentData.start_time,
      end_time: appointmentData.end_time,
      is_all_day: !!appointmentData.is_all_day,
      status: (appointmentData.status || "scheduled") as AppointmentStatus,
      assignee_id: appointmentData.assignee_id || null,
      appointment_type: appointmentData.appointment_type || "appointment"
    };
    
    // Insert the appointment
    const { data, error } = await supabase
      .from("appointments")
      .insert(completeAppointmentData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("Failed to create appointment: No data returned");
    }
    
    return data;
  } catch (error: any) {
    console.error("Error in createNewAppointment:", error);
    toast({
      title: "Error Creating Appointment",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    throw error;
  }
};
