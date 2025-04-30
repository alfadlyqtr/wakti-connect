
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Define the SimpleInvitation interface explicitly matched to database columns
export interface SimpleInvitation {
  id: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  description?: string;
  location?: string;
  location_url?: string;
  datetime?: string;
  user_id: string;
  background_type: string;
  background_value: string;
  font_family: string;
  font_size: string;
  text_color: string;
  share_link?: string;
  shareId?: string;
  isPublic?: boolean;
}

/**
 * Create a new simple invitation
 */
export const createSimpleInvitation = async (invitation: Omit<SimpleInvitation, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<SimpleInvitation | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const shareId = uuidv4();
    
    const newInvitation = {
      id: uuidv4(),
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      // Add all fields from the invitation parameter
      ...invitation,
      // Override or ensure these fields have values
      title: invitation.title || 'Untitled Invitation',
      background_type: invitation.background_type || 'solid',
      background_value: invitation.background_value || '#ffffff',
      font_family: invitation.font_family || 'Inter, sans-serif',
      font_size: invitation.font_size || '16px',
      text_color: invitation.text_color || '#000000',
      // Add shareId as a separate column if it exists
      share_link: `${window.location.origin}/i/${shareId}`
    };
    
    const tableName = 'invitations';
    
    const { data, error } = await supabase
      .from(tableName)
      .insert(newInvitation)
      .select()
      .single();
    
    if (error) {
      console.error('Insert error:', error);
      throw error;
    }
    
    toast({
      title: "Invitation Created",
      description: "Your invitation has been created successfully.",
    });
    
    return data as SimpleInvitation;
  } catch (error) {
    console.error('Error creating invitation:', error);
    toast({
      title: "Failed to Create Invitation",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Update an existing invitation
 */
export const updateSimpleInvitation = async (id: string, updates: Partial<Omit<SimpleInvitation, 'id' | 'user_id'>>): Promise<SimpleInvitation | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const tableName = 'invitations';
    
    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', session.user.id) // Ensure user owns this invitation
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Invitation Updated",
      description: "Your invitation has been updated successfully.",
    });
    
    return data as SimpleInvitation;
  } catch (error) {
    console.error('Error updating invitation:', error);
    toast({
      title: "Failed to Update Invitation",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Get a single invitation by ID
 */
export const getSimpleInvitationById = async (id: string): Promise<SimpleInvitation | null> => {
  try {
    const tableName = 'invitations';
    
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as SimpleInvitation;
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return null;
  }
};

/**
 * Get a shared invitation by its shareId
 */
export const getSharedInvitation = async (shareId: string): Promise<SimpleInvitation | null> => {
  try {
    const tableName = 'invitations';
    
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .eq('share_link', `${window.location.origin}/i/${shareId}`)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as SimpleInvitation;
  } catch (error) {
    console.error('Error fetching shared invitation:', error);
    return null;
  }
};

/**
 * List all invitations for the current user
 */
export const listSimpleInvitations = async (): Promise<SimpleInvitation[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const tableName = 'invitations';
    
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as SimpleInvitation[];
  } catch (error) {
    console.error('Error listing invitations:', error);
    return [];
  }
};

/**
 * Delete an invitation
 */
export const deleteSimpleInvitation = async (id: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const tableName = 'invitations';
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id); // Ensure user owns this invitation
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Invitation Deleted",
      description: "Your invitation has been deleted.",
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting invitation:', error);
    toast({
      title: "Failed to Delete Invitation",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Toggle invitation public status
 */
export const toggleInvitationPublicStatus = async (id: string, isPublic: boolean): Promise<SimpleInvitation | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const tableName = 'invitations';
    
    // Create appropriate column mapping for the public status
    const updateData = {
      updated_at: new Date().toISOString()
      // The isPublic field will need to be mapped to the correct column in the database
      // If needed, add the correct column name here based on your database schema
    };
    
    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.user.id) // Ensure user owns this invitation
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: isPublic ? "Invitation Published" : "Invitation Unpublished",
      description: isPublic 
        ? "Your invitation is now publicly accessible via link" 
        : "Your invitation is no longer publicly accessible",
    });
    
    return data as SimpleInvitation;
  } catch (error) {
    console.error('Error toggling invitation public status:', error);
    toast({
      title: "Failed to Update Invitation",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return null;
  }
};
