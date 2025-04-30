
import { supabase } from '@/integrations/supabase/client';
import { SimpleInvitation } from '@/types/invitation.types';

/**
 * List all simple invitations for the current user
 * @param isEvent - Optional filter to only return invitations that are events (true) or not events (false)
 */
export async function listSimpleInvitations(isEvent?: boolean): Promise<SimpleInvitation[]> {
  try {
    let query = supabase
      .from('invitations')
      .select('*');
      
    // If isEvent is provided, filter by is_event field
    if (isEvent !== undefined) {
      query = query.eq('is_event', isEvent);
    }

    // Add ordering by creation date (newest first)
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching invitations:', error);
      throw error;
    }

    // Transform data to match SimpleInvitation type
    const invitations: SimpleInvitation[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      location: item.location || '',
      locationTitle: item.locationTitle || '',
      date: item.datetime ? new Date(item.datetime).toISOString().split('T')[0] : undefined,
      time: item.datetime ? new Date(item.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
      customization: {
        background: {
          type: item.background_type || 'solid',
          value: item.background_value || '#ffffff',
        },
        font: {
          family: item.font_family || 'system-ui, sans-serif',
          size: item.font_size || 'medium',
          color: item.text_color || '#000000',
          alignment: 'center',
        },
      },
      isEvent: item.is_event || false
    }));
    
    return invitations;
  } catch (error) {
    console.error('Error in listSimpleInvitations:', error);
    return [];
  }
}

/**
 * Get a simple invitation by ID
 */
export async function getSimpleInvitationById(id: string): Promise<SimpleInvitation | null> {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching invitation:', error);
      throw error;
    }
    
    if (!data) return null;
    
    // Transform to SimpleInvitation type
    const invitation: SimpleInvitation = {
      id: data.id,
      title: data.title,
      description: data.description || '',
      location: data.location || '',
      locationTitle: data.locationTitle || '',
      date: data.datetime ? new Date(data.datetime).toISOString().split('T')[0] : undefined,
      time: data.datetime ? new Date(data.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
      customization: {
        background: {
          type: data.background_type || 'solid',
          value: data.background_value || '#ffffff',
        },
        font: {
          family: data.font_family || 'system-ui, sans-serif',
          size: data.font_size || 'medium',
          color: data.text_color || '#000000',
          alignment: 'center',
        },
      },
      isEvent: data.is_event || false
    };
    
    return invitation;
  } catch (error) {
    console.error('Error in getSimpleInvitationById:', error);
    return null;
  }
}

/**
 * Create a new simple invitation
 */
export async function createSimpleInvitation(data: any): Promise<SimpleInvitation | null> {
  try {
    const { data: createdInvitation, error } = await supabase
      .from('invitations')
      .insert([data])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }
    
    // Transform to SimpleInvitation type
    const invitation: SimpleInvitation = {
      id: createdInvitation.id,
      title: createdInvitation.title,
      description: createdInvitation.description || '',
      location: createdInvitation.location || '',
      locationTitle: createdInvitation.locationTitle || '',
      date: createdInvitation.datetime ? new Date(createdInvitation.datetime).toISOString().split('T')[0] : undefined,
      time: createdInvitation.datetime ? new Date(createdInvitation.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
      customization: {
        background: {
          type: createdInvitation.background_type || 'solid',
          value: createdInvitation.background_value || '#ffffff',
        },
        font: {
          family: createdInvitation.font_family || 'system-ui, sans-serif',
          size: createdInvitation.font_size || 'medium',
          color: createdInvitation.text_color || '#000000',
          alignment: 'center',
        },
      },
      isEvent: createdInvitation.is_event || false
    };
    
    return invitation;
  } catch (error) {
    console.error('Error in createSimpleInvitation:', error);
    return null;
  }
}

/**
 * Update an existing simple invitation
 */
export async function updateSimpleInvitation(id: string, data: any): Promise<SimpleInvitation | null> {
  try {
    const { data: updatedInvitation, error } = await supabase
      .from('invitations')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating invitation:', error);
      throw error;
    }
    
    // Transform to SimpleInvitation type
    const invitation: SimpleInvitation = {
      id: updatedInvitation.id,
      title: updatedInvitation.title,
      description: updatedInvitation.description || '',
      location: updatedInvitation.location || '',
      locationTitle: updatedInvitation.locationTitle || '',
      date: updatedInvitation.datetime ? new Date(updatedInvitation.datetime).toISOString().split('T')[0] : undefined,
      time: updatedInvitation.datetime ? new Date(updatedInvitation.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
      customization: {
        background: {
          type: updatedInvitation.background_type || 'solid',
          value: updatedInvitation.background_value || '#ffffff',
        },
        font: {
          family: updatedInvitation.font_family || 'system-ui, sans-serif',
          size: updatedInvitation.font_size || 'medium',
          color: updatedInvitation.text_color || '#000000',
          alignment: 'center',
        },
      },
      isEvent: updatedInvitation.is_event || false
    };
    
    return invitation;
  } catch (error) {
    console.error('Error in updateSimpleInvitation:', error);
    return null;
  }
}
