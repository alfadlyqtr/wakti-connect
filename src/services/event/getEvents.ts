
import { Event, EventTab, EventsResult } from '@/types/event.types';
import { supabase } from '@/integrations/supabase/client';

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
      
    const userRole = userProfile?.account_type || 'free';
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
    
    // Parse customization from JSON if needed and transform data
    const events: Event[] = (data || []).map((event: any) => {
      // Parse customization if it's a string
      let customization = event.customization;
      
      if (typeof customization === 'string') {
        try {
          customization = JSON.parse(customization);
        } catch (e) {
          console.warn('Failed to parse customization:', e);
          // Set default customization if parsing fails
          customization = {
            background: { type: 'solid', value: '#ffffff' },
            font: { family: 'system-ui, sans-serif', size: 'medium', color: '#333333' },
            buttons: {
              accept: { background: '#4CAF50', color: '#ffffff', shape: 'rounded' },
              decline: { background: '#f44336', color: '#ffffff', shape: 'rounded' }
            }
          };
        }
      }
      
      return {
        ...event,
        customization
      };
    });
    
    return {
      events,
      userRole: userRole as 'free' | 'individual' | 'business',
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
