
import { Event, EventFormData } from '@/types/event.types';
import { supabase } from '@/integrations/supabase/client';
import { prepareEventForStorage, transformDatabaseEvent } from './eventHelpers';
import { toast } from '@/components/ui/use-toast';

// Create a new event
export const createEvent = async (eventData: EventFormData): Promise<Event | null> => {
  try {
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to create an event');
    }
    
    // Prepare data for storage
    const preparedData = prepareEventForStorage({
      title: eventData.title,
      description: eventData.description,
      start_time: eventData.start_time || new Date(eventData.startDate || new Date()).toISOString(),
      end_time: eventData.end_time || (eventData.endDate ? new Date(eventData.endDate).toISOString() : null),
      is_all_day: eventData.isAllDay || false,
      location: eventData.location,
      location_title: eventData.location_title,
      location_type: eventData.location_type || 'manual',
      maps_url: eventData.maps_url,
      status: eventData.status || 'draft',
      user_id: session.user.id,
      customization: eventData.customization,
    });
    
    // Insert into database
    const { data, error } = await supabase
      .from('events')
      .insert(preparedData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }
    
    return transformDatabaseEvent(data);
  } catch (error: any) {
    console.error('Error in createEvent:', error);
    toast({
      variant: 'destructive',
      title: 'Error creating event',
      description: error.message || 'Failed to create event',
    });
    return null;
  }
};

// Update an existing event
export const updateEvent = async (eventId: string, eventData: EventFormData): Promise<Event | null> => {
  try {
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to update this event');
    }
    
    // Prepare data for storage
    const preparedData = prepareEventForStorage({
      title: eventData.title,
      description: eventData.description,
      start_time: eventData.start_time || new Date(eventData.startDate || new Date()).toISOString(),
      end_time: eventData.end_time || (eventData.endDate ? new Date(eventData.endDate).toISOString() : null),
      is_all_day: eventData.isAllDay || false,
      location: eventData.location,
      location_title: eventData.location_title,
      location_type: eventData.location_type || 'manual',
      maps_url: eventData.maps_url,
      status: eventData.status || 'draft',
      customization: eventData.customization,
    });
    
    // Update in database
    const { data, error } = await supabase
      .from('events')
      .update(preparedData)
      .eq('id', eventId)
      .eq('user_id', session.user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating event:', error);
      throw error;
    }
    
    return transformDatabaseEvent(data);
  } catch (error: any) {
    console.error('Error in updateEvent:', error);
    toast({
      variant: 'destructive',
      title: 'Error updating event',
      description: error.message || 'Failed to update event',
    });
    return null;
  }
};

// Get event by ID
export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to view this event');
    }
    
    // Query database
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('user_id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
    
    return transformDatabaseEvent(data);
  } catch (error: any) {
    console.error('Error in getEventById:', error);
    return null;
  }
};

// Get all user's events
export const getUserEvents = async (): Promise<Event[]> => {
  try {
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to view your events');
    }
    
    // Query database
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
    return data.map(transformDatabaseEvent);
  } catch (error: any) {
    console.error('Error in getUserEvents:', error);
    return [];
  }
};
