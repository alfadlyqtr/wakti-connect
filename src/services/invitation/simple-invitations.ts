
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SimpleInvitation } from '@/types/invitation.types';
import { InvitationDbRecord } from './invitation-types';

/**
 * Create a simple invitation record
 */
export const createSimpleInvitation = async (invitationData: any): Promise<SimpleInvitation | null> => {
  try {
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

    return data.map(record => {
      // Use the safer direct mapping approach here too
      return mapDbRecordToSimpleInvitation(record);
    }).filter(Boolean) as SimpleInvitation[];
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
 * Get a shared invitation by share ID
 */
export const getSharedInvitation = async (shareId: string): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('share_id', shareId)
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
 * Map a database record to a SimpleInvitation object
 * Using explicit mapping to avoid TypeScript "excessively deep instantiation" errors
 */
export function mapDbRecordToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation | null {
  if (!data) return null;

  // Break the deep type inference chain by using a simple Record type
  const customization = {
    background: {
      type: data.background_type || 'solid',
      value: data.background_value || '#ffffff'
    },
    font: {
      family: data.font_family || 'system-ui, sans-serif',
      size: data.font_size || 'medium',
      color: data.text_color || '#000000',
    }
  };

  if (data.text_align) {
    customization.font.alignment = data.text_align;
  }

  // Create intermediate result with simple typing
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
    shareId: data.share_id,
    isPublic: data.is_public || false,
    isEvent: !!data.is_event,
    customization: customization
  };

  // Use type assertion to SimpleInvitation without deep type checking
  return result as unknown as SimpleInvitation;
}

// Re-export listSimpleInvitations as an alias for fetchSimpleInvitations for backward compatibility
export const listSimpleInvitations = fetchSimpleInvitations;
