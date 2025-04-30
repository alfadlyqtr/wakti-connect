
import { supabase } from "@/integrations/supabase/client";
import { SimpleInvitation } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";
import { InvitationData } from "./invitation-types";
import { mapDatabaseToSimpleInvitation } from "./invitation-mappers";

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

    // Create a new array and map each item with explicit type
    const invitations: SimpleInvitation[] = [];
    for (let i = 0; i < data.length; i++) {
      invitations.push(mapDatabaseToSimpleInvitation(data[i]));
    }
    
    return invitations;
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
