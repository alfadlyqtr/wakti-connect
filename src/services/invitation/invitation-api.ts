
import { supabase } from '@/integrations/supabase/client';
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType } from '@/types/invitation.types';
import { InvitationDbRecord, InvitationData, SimpleInvitationResult } from './invitation-types';

/**
 * Create a new simple invitation in the database.
 */
export async function createSimpleInvitation(data: Partial<InvitationData>): Promise<SimpleInvitation | null> {
  try {
    const { data: insertedData, error } = await supabase
      .from('invitations')
      .insert([data])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating invitation:', error);
      return null;
    }

    if (!insertedData) return null;

    // Directly construct the result using type assertion to avoid deep type inference
    const result: SimpleInvitation = {
      id: insertedData.id,
      title: insertedData.title,
      description: insertedData.description || '',
      location: insertedData.location || '',
      locationTitle: insertedData.location_title || '',
      date: insertedData.datetime ? new Date(insertedData.datetime).toISOString().split('T')[0] : undefined,
      time: insertedData.datetime ? new Date(insertedData.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
      createdAt: insertedData.created_at,
      updatedAt: insertedData.updated_at,
      userId: insertedData.user_id,
      shareId: insertedData.share_link,
      isPublic: false, // Default value
      isEvent: insertedData.is_event || false,
      customization: {
        background: {
          type: (insertedData.background_type || 'solid') as BackgroundType,
          value: insertedData.background_value || '#ffffff',
        },
        font: {
          family: insertedData.font_family || 'system-ui, sans-serif',
          size: insertedData.font_size || 'medium',
          color: insertedData.text_color || '#000000',
          alignment: insertedData.text_align || 'left',
          weight: 'normal',
        },
      },
    };

    return result;
  } catch (error) {
    console.error('Error in createSimpleInvitation:', error);
    return null;
  }
}

/**
 * Update an existing simple invitation in the database.
 */
export async function updateSimpleInvitation(id: string, data: Partial<InvitationData>): Promise<SimpleInvitation | null> {
  try {
    const { data: updatedData, error } = await supabase
      .from('invitations')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating invitation:', error);
      return null;
    }

    if (!updatedData) return null;

    // Directly construct the result using type assertion to avoid deep type inference
    const result: SimpleInvitation = {
      id: updatedData.id,
      title: updatedData.title,
      description: updatedData.description || '',
      location: updatedData.location || '',
      locationTitle: updatedData.location_title || '',
      date: updatedData.datetime ? new Date(updatedData.datetime).toISOString().split('T')[0] : undefined,
      time: updatedData.datetime ? new Date(updatedData.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
      createdAt: updatedData.created_at,
      updatedAt: updatedData.updated_at,
      userId: updatedData.user_id,
      shareId: updatedData.share_link,
      isPublic: false, // Default value
      isEvent: updatedData.is_event || false,
      customization: {
        background: {
          type: (updatedData.background_type || 'solid') as BackgroundType,
          value: updatedData.background_value || '#ffffff',
        },
        font: {
          family: updatedData.font_family || 'system-ui, sans-serif',
          size: updatedData.font_size || 'medium',
          color: updatedData.text_color || '#000000',
          alignment: updatedData.text_align || 'left',
          weight: 'normal',
        },
      },
    };

    return result;
  } catch (error) {
    console.error('Error in updateSimpleInvitation:', error);
    return null;
  }
}

/**
 * Delete a simple invitation from the database.
 */
export async function deleteSimpleInvitation(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting invitation:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteSimpleInvitation:', error);
    return false;
  }
}

/**
 * Get a simple invitation by its ID.
 */
export async function getSimpleInvitationById(id: string): Promise<SimpleInvitation | null> {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error getting invitation by ID:', error);
      return null;
    }

    // Directly construct the result using type assertion to avoid deep type inference
    const result: SimpleInvitation = {
      id: data.id,
      title: data.title,
      description: data.description || '',
      location: data.location || '',
      locationTitle: data.location_title || '',
      date: data.datetime ? new Date(data.datetime).toISOString().split('T')[0] : undefined,
      time: data.datetime ? new Date(data.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
      shareId: data.share_link,
      isPublic: false, // Default value
      isEvent: data.is_event || false,
      customization: {
        background: {
          type: (data.background_type || 'solid') as BackgroundType,
          value: data.background_value || '#ffffff',
        },
        font: {
          family: data.font_family || 'system-ui, sans-serif',
          size: data.font_size || 'medium',
          color: data.text_color || '#000000',
          alignment: data.text_align || 'left',
          weight: 'normal',
        },
      },
    };

    return result;
  } catch (error) {
    console.error('Error in getSimpleInvitationById:', error);
    return null;
  }
}

/**
 * Get a shared invitation by its shareId.
 */
export async function getSharedInvitation(shareId: string): Promise<SimpleInvitation | null> {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('share_link', shareId)
      .single();

    if (error || !data) {
      console.error('Error getting shared invitation:', error);
      return null;
    }

    // Directly construct the result using type assertion to avoid deep type inference
    const result: SimpleInvitation = {
      id: data.id,
      title: data.title,
      description: data.description || '',
      location: data.location || '',
      locationTitle: data.location_title || '',
      date: data.datetime ? new Date(data.datetime).toISOString().split('T')[0] : undefined,
      time: data.datetime ? new Date(data.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
      shareId: data.share_link,
      isPublic: false, // Default value
      isEvent: data.is_event || false,
      customization: {
        background: {
          type: (data.background_type || 'solid') as BackgroundType,
          value: data.background_value || '#ffffff',
        },
        font: {
          family: data.font_family || 'system-ui, sans-serif',
          size: data.font_size || 'medium',
          color: data.text_color || '#000000',
          alignment: data.text_align || 'left',
          weight: 'normal',
        },
      },
    };

    return result;
  } catch (error) {
    console.error('Error in getSharedInvitation:', error);
    return null;
  }
}

/**
 * Fetch all simple invitations for the current user.
 */
export async function fetchSimpleInvitations(isEventFilter?: boolean): Promise<SimpleInvitation[]> {
  try {
    let query = supabase
      .from('invitations')
      .select('*');
    
    // Filter by user_id (only fetch the current user's invitations)
    query = query.order('created_at', { ascending: false });

    // Apply event filter if specified
    if (typeof isEventFilter === 'boolean') {
      query = query.eq('is_event', isEventFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching invitations:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Map the database records to SimpleInvitation objects using direct mapping
    return data.map((record: InvitationDbRecord): SimpleInvitation => ({
      id: record.id,
      title: record.title,
      description: record.description || '',
      location: record.location || '',
      locationTitle: record.location_title || '',
      date: record.datetime ? new Date(record.datetime).toISOString().split('T')[0] : undefined,
      time: record.datetime ? new Date(record.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      userId: record.user_id,
      shareId: record.share_link,
      isPublic: Boolean(record.is_public),
      isEvent: Boolean(record.is_event),
      customization: {
        background: {
          type: (record.background_type || 'solid') as BackgroundType,
          value: record.background_value || '#ffffff',
        },
        font: {
          family: record.font_family || 'system-ui, sans-serif',
          size: record.font_size || 'medium',
          color: record.text_color || '#000000',
          alignment: record.text_align || 'left',
          weight: 'normal',
        },
      },
    }));
  } catch (error) {
    console.error('Error in fetchSimpleInvitations:', error);
    return [];
  }
}
