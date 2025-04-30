
import { supabase } from "@/integrations/supabase/client";
import { SimpleInvitation, CreateSimpleInvitationRequest } from "@/types/invitation-simple.types";
import { BackgroundType } from "@/types/invitation.types";
import { toast } from "sonner";
import { nanoid } from "nanoid";

/**
 * Create a new simple invitation
 */
export const createSimpleInvitation = async (
  invitationData: CreateSimpleInvitationRequest
): Promise<SimpleInvitation | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    // Generate a unique share link identifier
    const shareId = nanoid(10);
    const shareLink = `${window.location.origin}/i/${shareId}`;
    
    // Create the invitation
    const { data, error } = await supabase
      .from('invitations')
      .insert({
        ...invitationData,
        user_id: session.user.id,
        share_link: shareId
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success("Invitation created successfully!");
    return {
      ...data,
      background_type: data.background_type as BackgroundType
    } as SimpleInvitation;
  } catch (error) {
    console.error('Error creating invitation:', error);
    toast.error(error instanceof Error ? error.message : "Failed to create invitation");
    return null;
  }
};

/**
 * Update an existing simple invitation
 */
export const updateSimpleInvitation = async (
  id: string,
  invitationData: Partial<CreateSimpleInvitationRequest>
): Promise<SimpleInvitation | null> => {
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
    
    toast.success("Invitation updated successfully!");
    return {
      ...data,
      background_type: data.background_type as BackgroundType
    } as SimpleInvitation;
  } catch (error) {
    console.error('Error updating invitation:', error);
    toast.error(error instanceof Error ? error.message : "Failed to update invitation");
    return null;
  }
};

/**
 * Get all simple invitations for the current user
 */
export const getSimpleInvitations = async (): Promise<SimpleInvitation[]> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      ...item,
      background_type: item.background_type as BackgroundType
    })) as SimpleInvitation[];
  } catch (error) {
    console.error('Error fetching invitations:', error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch invitations");
    return [];
  }
};

/**
 * Get a single invitation by ID
 */
export const getSimpleInvitationById = async (id: string): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      ...data,
      background_type: data.background_type as BackgroundType
    } as SimpleInvitation;
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return null;
  }
};

/**
 * Delete an invitation
 */
export const deleteSimpleInvitation = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success("Invitation deleted successfully!");
    return true;
  } catch (error) {
    console.error('Error deleting invitation:', error);
    toast.error(error instanceof Error ? error.message : "Failed to delete invitation");
    return false;
  }
};

/**
 * Get a public invitation by share link ID
 */
export const getSharedInvitation = async (shareId: string): Promise<SimpleInvitation | null> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('share_link', shareId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      ...data,
      background_type: data.background_type as BackgroundType
    } as SimpleInvitation;
  } catch (error) {
    console.error('Error fetching shared invitation:', error);
    return null;
  }
};
