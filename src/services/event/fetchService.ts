
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventsResult, EventWithInvitations } from "@/types/event.types";
import { transformDatabaseEvent } from "./eventHelpers";

// Simple helper function to check user role instead of importing from userService
const getUserRole = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return 'free';
  
  const { data } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', session.user.id)
    .single();
    
  return data?.account_type || 'free';
};

// Get all events for the current user
export const getAllEvents = async (): Promise<EventsResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return {
        events: [],
        userRole: 'free',
        canCreateEvents: false
      };
    }
    
    const userRole = await getUserRole();
    // Ensure userRole is compatible with EventsResult.userRole type
    const typedUserRole = ['free', 'individual', 'business'].includes(userRole) 
      ? userRole as 'free' | 'individual' | 'business'
      : 'free';
    
    const canCreateEvents = typedUserRole !== 'free';
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error("Error fetching events:", error);
      throw new Error(error.message);
    }
    
    // Transform database events to proper Event objects
    const events: Event[] = (data || []).map(transformDatabaseEvent);
    
    return {
      events,
      userRole: typedUserRole,
      canCreateEvents
    };
  } catch (error: any) {
    console.error("Error in getAllEvents:", error);
    return {
      events: [],
      userRole: 'free',
      canCreateEvents: false
    };
  }
};

// Get a single event by ID, including its invitations
export const getEventWithInvitations = async (eventId: string): Promise<EventWithInvitations | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("You must be logged in to view events");
    }
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        invitations:event_invitations (*)
      `)
      .eq('id', eventId)
      .eq('user_id', session.user.id)
      .single();
    
    if (error) {
      console.error("Error fetching event with invitations:", error);
      throw new Error(error.message);
    }
    
    // Transform to proper EventWithInvitations object with parsed customization
    return transformDatabaseEvent(data) as EventWithInvitations;
  } catch (error: any) {
    console.error("Error in getEventWithInvitations:", error);
    toast({
      title: "Failed to Load Event",
      description: error?.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};
