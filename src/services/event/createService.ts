
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
    
    // Add the user_id to the event data
    const completeEventData = {
      ...eventData,
      user_id: session.user.id,
      status: eventData.status || 'draft'
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

    return event;
  } catch (error: any) {
    console.error("Error in createEvent:", error);
    throw error;
  }
};
