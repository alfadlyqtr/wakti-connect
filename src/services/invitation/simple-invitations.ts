
import { supabase } from "@/integrations/supabase/client";
import { SimpleInvitation, SimpleInvitationCustomization } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";

interface InvitationData {
  title: string;
  description: string;
  location?: string;
  location_url?: string;
  location_title?: string;
  datetime?: string;
  background_type: string;
  background_value: string;
  font_family: string;
  font_size: string;
  text_color: string;
  is_event?: boolean;
  user_id: string;
}

/**
 * Create a new simple invitation
 */
export const createSimpleInvitation = async (invitationData: InvitationData): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .insert(invitationData)
      .select()
      .single();

    if (error) {
      console.error("Error creating invitation:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from invitation creation");
    }

    // Map database response to our SimpleInvitation type
    return mapDatabaseToSimpleInvitation(data);
  } catch (error) {
    console.error("Error in createSimpleInvitation:", error);
    toast({
      title: "Error",
      description: "Failed to create invitation",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Update an existing simple invitation
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
      console.error("Error updating invitation:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from invitation update");
    }

    // Map database response to our SimpleInvitation type
    return mapDatabaseToSimpleInvitation(data);
  } catch (error) {
    console.error("Error in updateSimpleInvitation:", error);
    toast({
      title: "Error",
      description: "Failed to update invitation",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Delete a simple invitation
 */
export const deleteSimpleInvitation = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting invitation:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteSimpleInvitation:", error);
    toast({
      title: "Error",
      description: "Failed to delete invitation",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Get a simple invitation by ID
 */
export const getSimpleInvitationById = async (id: string): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching invitation:", error);
      throw error;
    }

    if (!data) {
      return null;
    }

    // Map database response to our SimpleInvitation type
    return mapDatabaseToSimpleInvitation(data);
  } catch (error) {
    console.error("Error in getSimpleInvitationById:", error);
    toast({
      title: "Error",
      description: "Failed to retrieve invitation",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Get a simple invitation by share ID
 */
export const getSharedInvitation = async (shareId: string): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('share_id', shareId)
      .single();

    if (error) {
      console.error("Error fetching shared invitation:", error);
      throw error;
    }

    if (!data) {
      return null;
    }

    // Map database response to our SimpleInvitation type
    return mapDatabaseToSimpleInvitation(data);
  } catch (error) {
    console.error("Error in getSharedInvitation:", error);
    toast({
      title: "Error",
      description: "Failed to retrieve shared invitation",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * List all simple invitations for the current user
 */
export const listSimpleInvitations = async (isEvent = false): Promise<SimpleInvitation[]> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('is_event', isEvent)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching invitations:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Map database response to our SimpleInvitation type
    return data.map((item) => mapDatabaseToSimpleInvitation(item));
  } catch (error) {
    console.error("Error in listSimpleInvitations:", error);
    toast({
      title: "Error",
      description: "Failed to retrieve invitations",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Helper function to map database response to SimpleInvitation type
 */
function mapDatabaseToSimpleInvitation(data: any): SimpleInvitation {
  // Parse datetime if present
  let date: string | undefined;
  let time: string | undefined;
  
  if (data.datetime) {
    const dateObj = new Date(data.datetime);
    date = dateObj.toISOString().split('T')[0];
    time = dateObj.toTimeString().split(' ')[0].substring(0, 5);
  }
  
  // Create customization object
  const customization: SimpleInvitationCustomization = {
    background: {
      type: data.background_type as any,
      value: data.background_value || '#ffffff',
    },
    font: {
      family: data.font_family || 'system-ui, sans-serif',
      size: data.font_size || 'medium',
      color: data.text_color || '#000000',
      alignment: data.text_align || 'left',
    },
  };
  
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    location: data.location_url || data.location || '',
    locationTitle: data.location_title || '',
    date,
    time,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
    shareId: data.share_id || undefined,
    isPublic: data.is_public || false,
    isEvent: data.is_event || false,
    customization,
  };
}
