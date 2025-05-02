import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SimpleInvitation, SimpleInvitationCustomization } from '@/types/invitation.types';
import { InvitationData, InvitationDbRecord, SimpleInvitationResult } from './invitation-types';

/**
 * Create a simple invitation record
 */
export const createSimpleInvitation = async (invitationData: InvitationData): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .insert(invitationData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbRecordToSimpleInvitation(data);
  } catch (error) {
    console.error("Error creating invitation:", error);
    toast({
      title: "Error",
      description: "Failed to create invitation",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Update an existing invitation record
 */
export const updateSimpleInvitation = async (id: string, invitationData: Partial<InvitationData>): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .update(invitationData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapDbRecordToSimpleInvitation(data);
  } catch (error) {
    console.error("Error updating invitation:", error);
    toast({
      title: "Error",
      description: "Failed to update invitation",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Get a specific invitation by ID
 */
export const getSimpleInvitationById = async (id: string): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return mapDbRecordToSimpleInvitation(data);
  } catch (error) {
    console.error("Error fetching invitation:", error);
    toast({
      title: "Error",
      description: "Failed to fetch invitation",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Retrieve all invitations for the current user
 * @param isEvent Optional filter to only return events
 */
export const fetchSimpleInvitations = async (isEvent = false): Promise<SimpleInvitation[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No authenticated session');
    }

    let query = supabase
      .from('invitations')
      .select('*')
      .eq('user_id', session.user.id);
    
    // Add filter for events if specified
    if (isEvent) {
      query = query.eq('is_event', true);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapDbRecordToSimpleInvitation).filter(Boolean) as SimpleInvitation[];
  } catch (error) {
    console.error("Error fetching invitations:", error);
    toast({
      title: "Error",
      description: "Failed to fetch invitations",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Get a shared invitation by share ID
 */
export const getSharedInvitation = async (shareId: string): Promise<SimpleInvitation | null> => {
  try {
    // Try to find by share_link first, then by id if not found
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .or(`share_link.eq.${shareId},id.eq.${shareId}`)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }
    
    // Use type assertion to break the deep type inference chain
    // This prevents the TypeScript "excessively deep instantiation" error
    // Create the result explicitly to avoid complex type inference
    const result = {
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
      shareId: data.share_link || data.id, // Use share_link if available, otherwise fall back to ID
      isPublic: true, // If it's shared, we consider it public
      isEvent: !!data.is_event,
      customization: {
        background: {
          type: (data.background_type || 'solid') as any,
          value: data.background_value || '#ffffff'
        },
        font: {
          family: data.font_family || 'system-ui, sans-serif',
          size: data.font_size || 'medium',
          color: data.text_color || '#000000',
        }
      }
    } as SimpleInvitation;

    // Add alignment property only if text_align exists as a property on the data object
    if ('text_align' in data && data.text_align) {
      (result.customization.font as any).alignment = data.text_align;
    }

    return result;
  } catch (error) {
    console.error("Error fetching shared invitation:", error);
    toast({
      title: "Error",
      description: "Failed to fetch shared invitation",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Map a database record to a SimpleInvitation object
 * Using explicit mapping to avoid TypeScript "excessively deep instantiation" errors
 */
export function mapDbRecordToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation | null {
  if (!data) return null;

  // Use intermediate type to break the deep type inference chain
  const result: SimpleInvitationResult = {
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
    shareId: data.share_link || data.id, // Use share_link if available or fall back to ID
    isPublic: data.is_public || false,
    isEvent: !!data.is_event,
    customization: {
      background: {
        type: (data.background_type || 'solid') as any,
        value: data.background_value || '#ffffff'
      },
      font: {
        family: data.font_family || 'system-ui, sans-serif',
        size: data.font_size || 'medium',
        color: data.text_color || '#000000',
      }
    }
  };

  // Add alignment property only if text_align exists as a property on the data object
  if ('text_align' in data && data.text_align) {
    (result.customization.font as any).alignment = data.text_align;
  }

  // Cast to SimpleInvitation to maintain type compatibility
  return result as unknown as SimpleInvitation;
}
