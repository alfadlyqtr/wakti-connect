
import { supabase } from "@/integrations/supabase/client";
import { AppointmentFormData } from "../../types/appointment.types";
import { RecurringFormData } from "../../types/recurring.types";
import { createRecurringSetting } from "../recurring/recurringService";
import { toast } from "@/components/ui/use-toast";

/**
 * Creates a new appointment
 */
export async function createAppointment(formData: AppointmentFormData, recurring?: RecurringFormData): Promise<string> {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to create appointments");
    }
    
    // Check if the user can create appointments (paid accounts only)
    const { data: canCreate, error: permissionError } = await supabase
      .rpc('get_user_appointments_access', { user_uid: session.user.id });
    
    if (permissionError) {
      console.error("Error checking appointment creation permission:", permissionError);
      throw new Error(`Permission check failed: ${permissionError.message}`);
    }
    
    if (!canCreate) {
      throw new Error("This feature is only available for paid accounts");
    }
    
    // Prepare the appointment data
    const appointmentData = {
      user_id: session.user.id,
      title: formData.title,
      description: formData.description || null,
      location: formData.location || null,
      start_time: formData.start_time,
      end_time: formData.end_time,
      is_all_day: formData.is_all_day || false,
      status: formData.status || 'scheduled',
      assignee_id: formData.assignee_id || null
    };
    
    // Insert the appointment
    const { data: appointment, error: insertError } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();
    
    if (insertError) {
      console.error("Error creating appointment:", insertError);
      throw new Error(`Failed to create appointment: ${insertError.message}`);
    }
    
    // If this is a recurring appointment, create the recurring settings
    if (recurring) {
      try {
        await createRecurringSetting({
          entity_id: appointment.id,
          entity_type: 'appointment',
          created_by: session.user.id,
          frequency: recurring.frequency,
          interval: recurring.interval || 1,
          days_of_week: recurring.days_of_week,
          day_of_month: recurring.day_of_month,
          end_date: recurring.end_date,
          max_occurrences: recurring.max_occurrences
        });
      } catch (recurringError: any) {
        // If creating recurring settings fails, we'll show a warning but not fail the appointment creation
        console.error("Error creating recurring settings:", recurringError);
        toast({
          title: "Appointment Created",
          description: "Appointment was created, but recurring settings could not be applied. Try updating the appointment later.",
          variant: "destructive"
        });
        
        return appointment.id;
      }
    }
    
    // If there are invitees, create invitations
    if (formData.invitees && formData.invitees.length > 0) {
      const invitationData = formData.invitees.map(inviteeId => ({
        appointment_id: appointment.id,
        invited_user_id: inviteeId,
        status: 'pending',
        created_by: session.user.id
      }));
      
      const { error: invitationError } = await supabase
        .from('appointment_invitations')
        .insert(invitationData);
      
      if (invitationError) {
        console.error("Error creating invitations:", invitationError);
        // Don't throw here, just show a warning
        toast({
          title: "Invitation Error",
          description: "Appointment was created, but invitations could not be sent. You can retry sending invitations later.",
          variant: "destructive"
        });
      }
    }
    
    return appointment.id;
  } catch (error: any) {
    console.error("Error in createAppointment:", error);
    throw error;
  }
}
