
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType } from '@/types/invitation.types';
import { SimpleInvitationResult, InvitationDbRecord, InvitationData } from './invitation-types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Creates a new invitation
 */
export async function createSimpleInvitation(invitationData: Partial<SimpleInvitation>): Promise<SimpleInvitation | null> {
  try {
    // Convert from frontend model to database model
    const dbData = {
      title: invitationData.title || '',
      description: invitationData.description || '',
      location: invitationData.location || null,
      location_url: null,
      location_title: invitationData.locationTitle || null,
      datetime: invitationData.date ? new Date(invitationData.date).toISOString() : null,
      background_type: invitationData.customization?.background.type || 'solid',
      background_value: invitationData.customization?.background.value || '#ffffff',
      font_family: invitationData.customization?.font.family || 'system-ui, sans-serif',
      font_size: invitationData.customization?.font.size || 'medium',
      text_color: invitationData.customization?.font.color || '#000000',
      text_align: invitationData.customization?.font.alignment || 'left',
      is_event: invitationData.isEvent || false,
      user_id: (await supabase.auth.getSession()).data.session?.user?.id
    };

    const { data, error } = await supabase
      .from('invitations')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }

    if (!data) {
      console.error('No data returned after creating invitation');
      return null;
    }

    return mapDatabaseRecordToSimpleInvitation(data);
  } catch (error) {
    console.error('Failed to create invitation:', error);
    toast({
      title: 'Error',
      description: 'Failed to create invitation',
      variant: 'destructive',
    });
    return null;
  }
}

/**
 * Updates an existing invitation
 */
export async function updateSimpleInvitation(id: string, invitationData: Partial<SimpleInvitation>): Promise<SimpleInvitation | null> {
  try {
    // Convert from frontend model to database model
    const dbData: Partial<InvitationDbRecord> = {
      title: invitationData.title,
      description: invitationData.description,
      location: invitationData.location,
      location_title: invitationData.locationTitle,
      datetime: invitationData.date ? new Date(invitationData.date).toISOString() : null,
      updated_at: new Date().toISOString()
    };

    // Only update customization fields if they are provided
    if (invitationData.customization) {
      if (invitationData.customization.background) {
        dbData.background_type = invitationData.customization.background.type;
        dbData.background_value = invitationData.customization.background.value;
      }
      
      if (invitationData.customization.font) {
        dbData.font_family = invitationData.customization.font.family;
        dbData.font_size = invitationData.customization.font.size;
        dbData.text_color = invitationData.customization.font.color;
        dbData.text_align = invitationData.customization.font.alignment;
      }
    }

    const { data, error } = await supabase
      .from('invitations')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating invitation:', error);
      throw error;
    }

    return mapDatabaseRecordToSimpleInvitation(data);
  } catch (error) {
    console.error('Failed to update invitation:', error);
    toast({
      title: 'Error',
      description: 'Failed to update invitation',
      variant: 'destructive',
    });
    return null;
  }
}

/**
 * Deletes an invitation by ID
 */
export async function deleteSimpleInvitation(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting invitation:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete invitation:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete invitation',
      variant: 'destructive',
    });
    return false;
  }
}

/**
 * Fetches an invitation by ID
 */
export async function getSimpleInvitationById(id: string): Promise<SimpleInvitation | null> {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return mapDatabaseRecordToSimpleInvitation(data);
  } catch (error) {
    console.error('Failed to fetch invitation by id:', error);
    return null;
  }
}

/**
 * Fetches a list of invitations for the current user
 * @param isEvent Optional filter to get only events or non-events
 */
export async function fetchSimpleInvitations(isEvent?: boolean): Promise<SimpleInvitation[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session');
      return [];
    }

    let query = supabase
      .from('invitations')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    // If isEvent is explicitly defined (true or false), filter by that
    if (typeof isEvent !== 'undefined') {
      query = query.eq('is_event', isEvent);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching invitations:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Map each database record to the frontend model
    return data.map((record) => mapDatabaseRecordToSimpleInvitation(record));
  } catch (error) {
    console.error('Failed to fetch invitations:', error);
    return [];
  }
}

/**
 * Fetches a shared invitation by share ID
 */
export async function getSharedInvitation(shareId: string): Promise<SimpleInvitation | null> {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('share_link', shareId)
      .single();

    if (error) {
      console.error('Error fetching shared invitation:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Use manual mapping with explicit type assertion to avoid deep type inference
    const result = {
      id: data.id,
      title: data.title,
      description: data.description,
      location: data.location || '',
      locationTitle: data.location_title || '',
      date: data.datetime ? new Date(data.datetime).toISOString().split('T')[0] : undefined,
      time: data.datetime ? new Date(data.datetime).toLocaleTimeString() : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
      shareId: data.share_link,
      isPublic: !!data.share_link,
      isEvent: !!data.is_event,
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
        },
      },
    } as SimpleInvitation;

    return result;
  } catch (error) {
    console.error('Failed to fetch shared invitation:', error);
    return null;
  }
}

// Helper function to map database record to frontend model
function mapDatabaseRecordToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation {
  const result: SimpleInvitationResult = {
    id: data.id,
    title: data.title,
    description: data.description,
    location: data.location || '',
    locationTitle: data.location_title || '',
    date: data.datetime ? new Date(data.datetime).toISOString().split('T')[0] : undefined,
    time: data.datetime ? new Date(data.datetime).toLocaleTimeString() : undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
    shareId: data.share_id,
    isPublic: !!data.is_public,
    isEvent: !!data.is_event,
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
      },
    },
  };
  
  // Use type assertion to convert to SimpleInvitation
  return result as unknown as SimpleInvitation;
}
