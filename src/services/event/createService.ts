
import { toast } from "@/components/ui/use-toast";
import { Event, EventFormData, EventStatus } from "@/types/event.types";
import { supabase } from "@/integrations/supabase/client";
import { prepareEventForStorage, transformDatabaseEvent } from "./eventHelpers";

// Helper functions
const getUserProfile = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("You must be logged in to create events");
  }
  
  return {
    userId: session.user.id,
    userRole: 'individual' // Default to individual for now
  };
};

// Create a new event
export const createEvent = async (formData: EventFormData): Promise<Event | null> => {
  try {
    const { userId } = await getUserProfile();
    
    // Format the event data
    let startTimestamp = formData.start_time;
    if (!startTimestamp && formData.startDate) {
      // Convert startDate to ISO string if start_time is not provided
      startTimestamp = new Date(formData.startDate).toISOString();
    }
    
    let endTimestamp = formData.end_time;
    if (!endTimestamp && formData.endDate) {
      // Convert endDate to ISO string if end_time is not provided
      endTimestamp = new Date(formData.endDate).toISOString();
    }
    
    // Prepare the event object for insertion with proper JSON serialization
    const eventData = prepareEventForStorage({
      title: formData.title,
      description: formData.description,
      start_time: startTimestamp,
      end_time: endTimestamp,
      is_all_day: formData.isAllDay,
      location: formData.location,
      location_type: formData.location_type,
      maps_url: formData.maps_url,
      status: formData.status as EventStatus,
      user_id: userId,
      customization: formData.customization
    });
    
    // Insert the event into the database
    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating event:", error);
      throw new Error(error.message);
    }
    
    // If there are invitations, add them
    if (formData.invitations && formData.invitations.length > 0) {
      const invitationData = formData.invitations.map(invitation => ({
        event_id: event.id,
        email: invitation.email,
        invited_user_id: invitation.invited_user_id,
        status: invitation.status || 'pending',
        shared_as_link: invitation.shared_as_link || false
      }));
      
      const { error: invitationError } = await supabase
        .from('event_invitations')
        .insert(invitationData);
      
      if (invitationError) {
        toast({
          title: "Warning",
          description: "Event created but there was an issue sending invitations",
          variant: "destructive",
        });
      }
    }
    
    return transformDatabaseEvent(event);
  } catch (error: any) {
    console.error("Error in createEvent:", error);
    return null;
  }
};
