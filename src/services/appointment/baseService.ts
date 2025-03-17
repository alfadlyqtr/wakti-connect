
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AppointmentFormData, AppointmentStatus } from "./types";
import { validateAppointmentStatus } from "./utils/statusValidator";

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
    
    // Validate required input fields
    if (!appointmentData.title || appointmentData.title.trim() === '') {
      throw new Error("Appointment title is required");
    }
    
    if (!appointmentData.start_time) {
      throw new Error("Appointment start time is required");
    }
    
    if (!appointmentData.end_time) {
      throw new Error("Appointment end time is required");
    }
    
    // Validate start time is before end time
    const startTime = new Date(appointmentData.start_time);
    const endTime = new Date(appointmentData.end_time);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error("Invalid date format for start or end time");
    }
    
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }
    
    // Validate and normalize status
    const status = validateAppointmentStatus(appointmentData.status || "scheduled");
    
    // Prepare the appointment data with all required fields and proper types
    const completeAppointmentData = {
      user_id: session.user.id,
      title: appointmentData.title.trim(),
      description: appointmentData.description?.trim() || null,
      location: appointmentData.location?.trim() || null,
      start_time: appointmentData.start_time,
      end_time: appointmentData.end_time,
      is_all_day: Boolean(appointmentData.is_all_day),
      status: status,
      assignee_id: appointmentData.assignee_id || null,
      appointment_type: appointmentData.appointment_type?.trim() || "appointment"
    };
    
    // Insert the appointment with detailed error handling
    const { data, error } = await supabase
      .from("appointments")
      .insert(completeAppointmentData)
      .select()
      .single();
    
    if (error) {
      console.error("Database error creating appointment:", error);
      
      // Provide more specific error messages based on error codes
      if (error.code === '23505') {
        throw new Error("An appointment with these details already exists");
      } else if (error.code === '23503') {
        throw new Error("Referenced user or assignee does not exist");
      } else if (error.code === '42501') {
        throw new Error("You don't have permission to create appointments");
      } else {
        throw new Error(`Failed to create appointment: ${error.message}`);
      }
    }
    
    if (!data) {
      throw new Error("Failed to create appointment: No data returned");
    }
    
    return data;
  } catch (error: any) {
    console.error("Error in createNewAppointment:", error);
    
    // Format the error message for toast notification
    const errorMessage = error.message || "An unexpected error occurred";
    
    toast({
      title: "Error Creating Appointment",
      description: errorMessage,
      variant: "destructive",
    });
    
    throw error;
  }
};
