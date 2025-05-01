import { supabase } from "@/integrations/supabase/client";
import { SimpleInvitation } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";
import { InvitationData, InvitationDbRecord } from "./invitation-types";

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
    
    // Direct mapping to avoid deep type instantiation
    const record = data as InvitationDbRecord;
    
    // Parse datetime if present
    let date: string | undefined;
    let time: string | undefined;
    
    if (record.datetime) {
      const dateObj = new Date(record.datetime);
      date = dateObj.toISOString().split('T')[0];
      time = dateObj.toTimeString().split(' ')[0].substring(0, 5);
    }
    
    // Map directly to SimpleInvitation with explicit properties
    const invitation: SimpleInvitation = {
      id: record.id,
      title: record.title,
      description: record.description || '',
      location: record.location_url || record.location || '',
      locationTitle: record.location_title || '',
      date,
      time,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      userId: record.user_id,
      shareId: record.share_id,
      isPublic: record.is_public || false,
      isEvent: record.is_event || false,
      customization: {
        background: {
          type: (record.background_type || 'solid') as 'solid' | 'gradient' | 'image' | 'ai',
          value: record.background_value || '#ffffff',
        },
        font: {
          family: record.font_family || 'system-ui, sans-serif',
          size: record.font_size || 'medium',
          color: record.text_color || '#000000',
          alignment: record.text_align || 'left',
          weight: 'normal',
        }
      }
    };

    return invitation;
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
    
    // Direct mapping to avoid deep type instantiation
    const record = data as InvitationDbRecord;
    
    // Parse datetime if present
    let date: string | undefined;
    let time: string | undefined;
    
    if (record.datetime) {
      const dateObj = new Date(record.datetime);
      date = dateObj.toISOString().split('T')[0];
      time = dateObj.toTimeString().split(' ')[0].substring(0, 5);
    }
    
    // Map directly to SimpleInvitation with explicit properties
    const invitation: SimpleInvitation = {
      id: record.id,
      title: record.title,
      description: record.description || '',
      location: record.location_url || record.location || '',
      locationTitle: record.location_title || '',
      date,
      time,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      userId: record.user_id,
      shareId: record.share_id,
      isPublic: record.is_public || false,
      isEvent: record.is_event || false,
      customization: {
        background: {
          type: (record.background_type || 'solid') as 'solid' | 'gradient' | 'image' | 'ai',
          value: record.background_value || '#ffffff',
        },
        font: {
          family: record.font_family || 'system-ui, sans-serif',
          size: record.font_size || 'medium',
          color: record.text_color || '#000000',
          alignment: record.text_align || 'left',
          weight: 'normal',
        }
      }
    };

    return invitation;
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
    
    // Direct mapping to avoid deep type instantiation
    const record = data as InvitationDbRecord;
    
    // Parse datetime if present
    let date: string | undefined;
    let time: string | undefined;
    
    if (record.datetime) {
      const dateObj = new Date(record.datetime);
      date = dateObj.toISOString().split('T')[0];
      time = dateObj.toTimeString().split(' ')[0].substring(0, 5);
    }
    
    // Map directly to SimpleInvitation with explicit properties
    const invitation: SimpleInvitation = {
      id: record.id,
      title: record.title,
      description: record.description || '',
      location: record.location_url || record.location || '',
      locationTitle: record.location_title || '',
      date,
      time,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      userId: record.user_id,
      shareId: record.share_id,
      isPublic: record.is_public || false,
      isEvent: record.is_event || false,
      customization: {
        background: {
          type: (record.background_type || 'solid') as 'solid' | 'gradient' | 'image' | 'ai',
          value: record.background_value || '#ffffff',
        },
        font: {
          family: record.font_family || 'system-ui, sans-serif',
          size: record.font_size || 'medium',
          color: record.text_color || '#000000',
          alignment: record.text_align || 'left',
          weight: 'normal',
        }
      }
    };

    return invitation;
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
    
    // Direct mapping to avoid deep type instantiation
    const record = data as InvitationDbRecord;
    
    // Parse datetime if present
    let date: string | undefined;
    let time: string | undefined;
    
    if (record.datetime) {
      const dateObj = new Date(record.datetime);
      date = dateObj.toISOString().split('T')[0];
      time = dateObj.toTimeString().split(' ')[0].substring(0, 5);
    }
    
    // Map directly to SimpleInvitation with explicit properties
    const invitation: SimpleInvitation = {
      id: record.id,
      title: record.title,
      description: record.description || '',
      location: record.location_url || record.location || '',
      locationTitle: record.location_title || '',
      date,
      time,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      userId: record.user_id,
      shareId: record.share_id,
      isPublic: record.is_public || false,
      isEvent: record.is_event || false,
      customization: {
        background: {
          type: (record.background_type || 'solid') as 'solid' | 'gradient' | 'image' | 'ai',
          value: record.background_value || '#ffffff',
        },
        font: {
          family: record.font_family || 'system-ui, sans-serif',
          size: record.font_size || 'medium',
          color: record.text_color || '#000000',
          alignment: record.text_align || 'left',
          weight: 'normal',
        }
      }
    };

    return invitation;
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

// A simplified type that doesn't rely on complex type inference
type InvitationWithBasicProps = {
  id: string;
  title: string;
  description: string;
  location_url?: string;
  location?: string;
  location_title?: string;
  datetime?: string;
  background_type: string;
  background_value: string;
  font_family: string;
  font_size: string;
  text_color: string;
  text_align?: string;
  is_event?: boolean;
  created_at: string;
  updated_at?: string;
  share_id?: string;
  is_public?: boolean;
  user_id: string;
};

/**
 * New simplified function to fetch invitations that avoids excessive type instantiation
 * This replaces the problematic listSimpleInvitations function
 */
export const fetchSimpleInvitations = async (isEvent = false): Promise<SimpleInvitation[]> => {
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
    
    // Convert to a simpler type first to break reference chains
    const records = data as InvitationWithBasicProps[];
    
    // Map invitations one by one with explicit type construction
    const invitations = records.map(record => {
      // Parse datetime if present
      let date: string | undefined;
      let time: string | undefined;
      
      if (record.datetime) {
        const dateObj = new Date(record.datetime);
        date = dateObj.toISOString().split('T')[0];
        time = dateObj.toTimeString().split(' ')[0].substring(0, 5);
      }
      
      // Construct the invitation with explicit properties
      const invitation: SimpleInvitation = {
        id: record.id,
        title: record.title,
        description: record.description || '',
        location: record.location_url || record.location || '',
        locationTitle: record.location_title || '',
        date,
        time,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        userId: record.user_id,
        shareId: record.share_id,
        isPublic: record.is_public || false,
        isEvent: record.is_event || false,
        customization: {
          background: {
            type: (record.background_type || 'solid') as 'solid' | 'gradient' | 'image' | 'ai',
            value: record.background_value || '#ffffff',
          },
          font: {
            family: record.font_family || 'system-ui, sans-serif',
            size: record.font_size || 'medium',
            color: record.text_color || '#000000',
            alignment: record.text_align || 'left',
            weight: 'normal',
          }
        }
      };
      
      return invitation;
    });
    
    return invitations;
  } catch (error) {
    console.error("Error in fetchSimpleInvitations:", error);
    toast({
      title: "Error",
      description: "Failed to retrieve invitations",
      variant: "destructive",
    });
    return [];
  }
};

// Keep the original function for reference but mark it as deprecated
/**
 * List all simple invitations for the current user
 * @deprecated Use fetchSimpleInvitations instead to avoid type instantiation errors
 */
export const listSimpleInvitations = fetchSimpleInvitations;
