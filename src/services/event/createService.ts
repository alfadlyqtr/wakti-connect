
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { EventFormData, Event } from "@/types/event.types";

/**
 * Creates a new event with account type permission checking
 */
export const createEvent = async (
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
        description: "Creating events requires an Individual or Business subscription",
        variant: "destructive",
      });
      throw new Error("Subscription required to create events");
    }
    
    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.error("No authenticated user for event creation");
      throw new Error("Authentication required to create events");
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
    
    console.log("Creating event with data:", eventData);
    
    // Add the user_id to the event data
    const completeEventData = {
      user_id: session.user.id,
      title: eventData.title.trim(),
      description: eventData.description || '',
      location: eventData.location || '',
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      is_all_day: eventData.is_all_day || false,
      status: eventData.status || 'draft',
      customization: JSON.stringify(eventData.customization || {})
    };

    const { data: event, error } = await supabase
      .from("events")
      .insert(completeEventData)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error creating event:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!event) {
      throw new Error("Failed to create event: No data returned");
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
    console.error("Error in createEvent:", error);
    throw error;
  }
};
