
import { supabase } from "@/integrations/supabase/client";
import { Event, EventTab, EventsResult } from "@/types/event.types";

export const getEvents = async (tab: EventTab): Promise<EventsResult> => {
  try {
    // Get user's subscription type to determine what they can do
    const { data: userRole, error: roleError } = await supabase.rpc(
      "get_user_subscription_type"
    );

    if (roleError) {
      console.error("Error getting user role:", roleError);
      throw new Error(`Failed to get user role: ${roleError.message}`);
    }

    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      throw new Error("No authenticated user");
    }

    let query;
    
    if (tab === 'my-events') {
      // Get events created by the user
      query = supabase
        .from("events")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
    } 
    else if (tab === 'invited-events') {
      // Get events the user has been invited to
      query = supabase
        .from("event_invitations")
        .select(`
          event:events(*)
        `)
        .eq("invited_user_id", session.user.id)
        .order("created_at", { ascending: false });
    }
    else if (tab === 'draft-events') {
      // Get draft events created by the user
      query = supabase
        .from("events")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status", "draft")
        .order("created_at", { ascending: false });
    }
    else {
      throw new Error(`Invalid tab: ${tab}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching events:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    let events: Event[] = [];
    
    if (tab === 'invited-events') {
      // Extract events from the nested structure
      events = data.map((item: any) => {
        const event = item.event;
        // Parse the customization JSON if it's stored as a string
        if (typeof event.customization === 'string') {
          event.customization = JSON.parse(event.customization);
        }
        return event;
      });
    } else {
      events = data.map((event: any) => {
        // Parse the customization JSON if it's stored as a string
        if (typeof event.customization === 'string') {
          event.customization = JSON.parse(event.customization);
        }
        return event;
      });
    }

    return {
      events,
      userRole: userRole || 'free'
    };
  } catch (error: any) {
    console.error("Error in getEvents:", error);
    // Return empty results rather than throwing to prevent UI crashes
    return {
      events: [],
      userRole: 'free'
    };
  }
};
