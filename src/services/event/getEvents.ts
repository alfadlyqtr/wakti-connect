
import { Event, EventTab, EventsResult } from '@/types/event.types';
import { supabase } from '@/integrations/supabase/client';
import { transformDatabaseEvent } from './eventHelpers';

/**
 * Get events based on tab (my-events, invited-events, draft-events)
 */
export const getEvents = async (tab: EventTab): Promise<EventsResult> => {
  try {
    // Get current user session
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      throw new Error('Not authenticated');
    }
    
    const userId = session.session.user.id;
    
    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', userId)
      .single();
      
    const userProfileType = userProfile?.account_type || 'free';
    // Ensure userRole is compatible with EventsResult.userRole type
    const userRole = ['free', 'individual', 'business'].includes(userProfileType) 
      ? userProfileType as 'free' | 'individual' | 'business'
      : 'free';
    
    const canCreateEvents = userRole !== 'free';
      
    // Different queries based on tab
    let eventQuery;
    
    if (tab === 'my-events') {
      // Get events created by the user
      eventQuery = supabase
        .from('events')
        .select(`
          *,
          event_invitations (
            id,
            email,
            invited_user_id,
            status,
            shared_as_link,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .not('status', 'eq', 'draft') // Exclude drafts
        .order('created_at', { ascending: false });
    } 
    else if (tab === 'invited-events') {
      // Get events the user is invited to
      eventQuery = supabase
        .from('events')
        .select(`
          *,
          event_invitations!inner (
            id,
            email,
            invited_user_id,
            status,
            shared_as_link,
            created_at,
            updated_at
          )
        `)
        .eq('event_invitations.invited_user_id', userId)
        .order('created_at', { ascending: false });
    } 
    else if (tab === 'draft-events') {
      // Get draft events created by the user
      eventQuery = supabase
        .from('events')
        .select(`
          *,
          event_invitations (
            id,
            email,
            invited_user_id,
            status,
            shared_as_link,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'draft')
        .order('created_at', { ascending: false });
    }
    
    const { data, error } = await eventQuery;
    
    if (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
    
    // Transform data to ensure proper customization parsing
    const events: Event[] = (data || []).map((event: any) => transformDatabaseEvent(event));
    
    return {
      events,
      userRole,
      canCreateEvents
    };
    
  } catch (error) {
    console.error('Error in getEvents:', error);
    return {
      events: [],
      userRole: 'free',
      canCreateEvents: false
    };
  }
};
