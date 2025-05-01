
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
 * Using a completely new approach to avoid TypeScript "excessively deep instantiation" errors
 */
export function mapDbRecordToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation | null {
  if (!data) return null;
  
  // Create the background object
  const background = {
    type: data.background_type || 'solid',
    value: data.background_value || '#ffffff'
  };
  
  // Create the font object with optional alignment
  let font: any = {
    family: data.font_family || 'system-ui, sans-serif',
    size: data.font_size || 'medium',
    color: data.text_color || '#000000'
  };
  
  // Only add alignment if it exists in the data
  if (data.text_align) {
    font.alignment = data.text_align;
  }
  
  // Create the customization object
  const customization = {
    background: background,
    font: font
  };
  
  // Create the SimpleInvitation object
  const invitation = {
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
  
  // Cast the object to SimpleInvitation type and return it
  return invitation as SimpleInvitation;
}

// Re-export listSimpleInvitations as an alias for fetchSimpleInvitations for backward compatibility
export const listSimpleInvitations = fetchSimpleInvitations;
