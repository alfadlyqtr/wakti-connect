
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { EventFormData, Event } from "@/types/event.types";

/**
 * Updates an existing event with account type permission checking
 */
export const updateEvent = async (
  eventId: string,
  eventData: EventFormData
): Promise<Event> => {
  try {
    // Check if the user can create events (only business and individual accounts)
    const { data: canCreate, error: permissionError } = await supabase.rpc(
      "can_create_event"
    );

    if (permissionError) {
      console.error("Permission check failed:", permissionError);
      throw new Error(`Permission check failed: ${permissionError.message}`);
    }

    if (!canCreate) {
      toast({
        title: "Subscription Required",
        description: "Editing events requires an Individual or Business subscription",
        variant: "destructive",
      });
      throw new Error("Subscription required to update events");
    }
    
    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.error("No authenticated user for event update");
      throw new Error("Authentication required to update events");
    }

    // Ensure title is present and not empty
    if (!eventData.title || !eventData.title.trim()) {
      console.error("Event title is missing or empty");
      throw new Error("Event title is required");
    }

    // Ensure start_time and end_time are present
    if (!eventData.start_time || !eventData.end_time) {
      throw new Error("Event must have start and end times");
    }
    
    console.log("Updating event with data:", eventData);
    
    // Prepare the update data
    const updateEventData = {
      title: eventData.title.trim(),
      description: eventData.description || '',
      location: eventData.location || '',
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      is_all_day: eventData.is_all_day || false,
      status: eventData.status || 'draft',
      customization: JSON.stringify(eventData.customization || {})
    };

    // Check that the event exists and belongs to the user
    const { data: existingEvent, error: checkError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .eq("user_id", session.user.id)
      .single();

    if (checkError) {
      console.error("Supabase Error checking event:", checkError);
      throw new Error(`Cannot update event: ${checkError.message}`);
    }

    if (!existingEvent) {
      throw new Error("Event not found or you don't have permission to update it");
    }

    // Update the event
    const { data: event, error } = await supabase
      .from("events")
      .update(updateEventData)
      .eq("id", eventId)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error updating event:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!event) {
      throw new Error("Failed to update event: No data returned");
    }

    // Parse the stored JSON customization back into an object
    const parsedEvent: Event = {
      ...event,
      customization: typeof event.customization === 'string' 
        ? JSON.parse(event.customization) 
        : event.customization
    };

    return parsedEvent;
  } catch (error: any) {
    console.error("Error in updateEvent:", error);
    throw error;
  }
};
