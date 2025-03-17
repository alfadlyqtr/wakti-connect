
import { supabase } from "@/integrations/supabase/client";
import { EventTab, Event, EventsResult } from "@/types/event.types";

/**
 * Fetches events based on the selected tab
 */
export const fetchEvents = async (
  tab: EventTab
): Promise<EventsResult> => {
  try {
    let events: Event[] = [];

    // Get the user's account type (free, individual, business)
    const { data: userRoleData, error: roleError } = await supabase.rpc(
      "get_auth_user_account_type"
    );

    if (roleError) {
      console.error("Error checking user role:", roleError);
      throw new Error(`Failed to check user role: ${roleError.message}`);
    }

    // Make sure userRole is one of the allowed values
    let userRole: "free" | "individual" | "business";
    if (userRoleData === "individual") {
      userRole = "individual";
    } else if (userRoleData === "business") {
      userRole = "business";
    } else {
      userRole = "free";
    }
    
    // Store user role in localStorage for access in components
    localStorage.setItem('userRole', userRole);

    // Fetch events based on the selected tab
    try {
      switch (tab) {
        case "my-events":
          // Fetch events created by the user
          const { data: myEvents, error: myEventsError } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', await getUserId())
            .order('created_at', { ascending: false });
            
          if (myEventsError) throw myEventsError;
          events = myEvents || [];
          break;
          
        case "invited-events":
          // Fetch events the user is invited to
          const { data: invitations, error: invitationsError } = await supabase
            .from('event_invitations')
            .select(`
              *,
              event:event_id (*)
            `)
            .eq('invited_user_id', await getUserId())
            .order('created_at', { ascending: false });
            
          if (invitationsError) throw invitationsError;
          events = invitations
            .filter(inv => inv.event)
            .map(inv => inv.event) as Event[];
          break;
          
        case "draft-events":
          // Fetch draft events created by the user
          const { data: draftEvents, error: draftEventsError } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', await getUserId())
            .eq('status', 'draft')
            .order('created_at', { ascending: false });
            
          if (draftEventsError) throw draftEventsError;
          events = draftEvents || [];
          break;
            
        default:
          const { data: defaultEvents, error: defaultEventsError } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', await getUserId())
            .order('created_at', { ascending: false });
            
          if (defaultEventsError) throw defaultEventsError;
          events = defaultEvents || [];
      }
    } catch (fetchError: any) {
      console.error(`Error fetching events for tab "${tab}":`, fetchError);
      events = [];
    }

    return {
      events,
      userRole
    };
  } catch (error: any) {
    console.error("Error in fetchEvents:", error);
    return {
      events: [],
      userRole: "free"
    };
  }
};

/**
 * Helper to get the current user ID
 */
const getUserId = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("No authenticated user");
  }
  return session.user.id;
};
