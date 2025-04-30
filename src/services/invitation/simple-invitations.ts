
import { supabase } from '@/integrations/supabase/client';
import { SimpleInvitation, BackgroundType } from '@/types/invitation.types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

/**
 * Create a new simple invitation
 */
export const createSimpleInvitation = async (invitation: Omit<SimpleInvitation, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<SimpleInvitation | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const newInvitation: SimpleInvitation = {
      ...invitation,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      userId: session.user.id,
      shareId: uuidv4(), // Generate a unique share ID
    };
    
    const { data, error } = await supabase
      .from('simple_invitations')
      .insert(newInvitation)
      .select()
      .single();
    
    if (error) {
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
export const updateSimpleInvitation = async (id: string, updates: Partial<SimpleInvitation>): Promise<SimpleInvitation | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const { data, error } = await supabase
      .from('simple_invitations')
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .eq('userId', session.user.id) // Ensure user owns this invitation
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
    const { data, error } = await supabase
      .from('simple_invitations')
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
    const { data, error } = await supabase
      .from('simple_invitations')
      .select()
      .eq('shareId', shareId)
      .eq('isPublic', true)
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
    
    const { data, error } = await supabase
      .from('simple_invitations')
      .select()
      .eq('userId', session.user.id)
      .order('createdAt', { ascending: false });
    
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
    
    const { error } = await supabase
      .from('simple_invitations')
      .delete()
      .eq('id', id)
      .eq('userId', session.user.id); // Ensure user owns this invitation
    
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
    
    const { data, error } = await supabase
      .from('simple_invitations')
      .update({
        isPublic,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .eq('userId', session.user.id) // Ensure user owns this invitation
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
