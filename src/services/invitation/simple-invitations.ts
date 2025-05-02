
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SimpleInvitation } from '@/types/invitation.types';
import { InvitationDbRecord } from './invitation-types';

/**
 * Create a simple invitation record
 */
export const createSimpleInvitation = async (invitationData: any): Promise<SimpleInvitation | null> => {
  try {
    // Generate a unique share_link if not provided
    if (!invitationData.share_link) {
      invitationData.share_link = generateUniqueShareId();
    }

    const { data, error } = await supabase
      .from('invitations')
      .insert(invitationData)
      .select()
      .single();

    if (error) {
      console.error("Error creating invitation:", error);
      toast({
        title: "Error",
        description: "Failed to create invitation",
        variant: "destructive",
      });
      return null;
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
export const updateSimpleInvitation = async (id: string, invitationData: any): Promise<SimpleInvitation | null> => {
  try {
    // Ensure share_link exists
    if (!invitationData.share_link && 'is_public' in invitationData && invitationData.is_public) {
      invitationData.share_link = generateUniqueShareId();
    }

    const { data, error } = await supabase
      .from('invitations')
      .update(invitationData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating invitation:", error);
      toast({
        title: "Error",
        description: "Failed to update invitation",
        variant: "destructive",
      });
      return null;
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
      console.error("Error fetching invitation:", error);
      toast({
        title: "Error",
        description: "Failed to fetch invitation",
        variant: "destructive",
      });
      return null;
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
      console.error("Error fetching invitations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch invitations",
        variant: "destructive",
      });
      return [];
    }

    // Map the data to SimpleInvitation objects, filtering out any nulls
    const invitations: SimpleInvitation[] = [];
    for (const record of data) {
      const invitation = mapDbRecordToSimpleInvitation(record);
      if (invitation) {
        invitations.push(invitation);
      }
    }
    return invitations;
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
 * Delete a simple invitation by ID
 * @param id The ID of the invitation to delete
 * @returns A boolean indicating success or failure
 */
export const deleteSimpleInvitation = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting invitation:", error);
      toast({
        title: "Error",
        description: "Failed to delete invitation",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting invitation:", error);
    toast({
      title: "Error",
      description: "Failed to delete invitation",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Get a shared invitation by share link
 */
export const getSharedInvitation = async (shareLink: string): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('share_link', shareLink)
      .maybeSingle();

    if (error) {
      console.error("Error fetching shared invitation:", error);
      toast({
        title: "Error",
        description: "Failed to fetch shared invitation",
        variant: "destructive",
      });
      return null;
    }

    if (!data) {
      return null;
    }

    return mapDbRecordToSimpleInvitation(data);
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
 * Generate a unique share ID for invitations
 */
export const generateUniqueShareId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

/**
 * Map a database record to a SimpleInvitation object
 * Completely refactored to fix "excessively deep instantiation" TypeScript error
 */
export function mapDbRecordToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation | null {
  if (!data) return null;
  
  // Use a simpler approach to avoid excessive type instantiation
  const result: SimpleInvitation = {
    id: data.id,
    title: data.title,
    description: data.description || '',
    fromName: data.from_name || '',
    location: data.location || '',
    locationTitle: data.location_title || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
    shareId: data.share_link, // We use share_link here
    isPublic: data.is_public || false,
    isEvent: !!data.is_event,
    date: data.datetime ? new Date(data.datetime).toISOString().split('T')[0] : undefined,
    time: data.datetime ? new Date(data.datetime).toISOString().split('T')[1].substring(0, 5) : undefined,
    endTime: data.end_time ? new Date(data.end_time).toISOString().split('T')[1].substring(0, 5) : undefined,
    customization: {
      background: {
        type: (data.background_type || 'solid') as any,
        value: data.background_value || '#ffffff'
      },
      font: {
        family: data.font_family || 'system-ui, sans-serif',
        size: data.font_size || 'medium',
        color: data.text_color || '#000000',
        alignment: data.text_align || 'left'
      }
    }
  };
  
  return result;
}

// Re-export listSimpleInvitations as an alias for fetchSimpleInvitations for backward compatibility
export const listSimpleInvitations = fetchSimpleInvitations;
