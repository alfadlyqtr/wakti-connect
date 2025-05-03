
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SimpleInvitation } from '@/types/invitation.types';
import { mapDbRecordToSimpleInvitation } from '../utils/invitation-mappers';

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
 * Get a shared invitation by share ID (share_link or id)
 */
export const getSharedInvitation = async (shareId: string): Promise<SimpleInvitation | null> => {
  try {
    console.log("Fetching shared invitation with ID:", shareId);
    
    // Try to find the invitation by share_link first
    let { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('share_link', shareId)
      .maybeSingle();
      
    // If not found by share_link, try by id
    if (!data && !error) {
      console.log("No invitation found with share_link, trying id");
      const result = await supabase
        .from('invitations')
        .select('*')
        .eq('id', shareId)
        .maybeSingle();
        
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    if (!data) {
      console.log("No invitation found with either share_link or id:", shareId);
      return null;
    }
    
    console.log("Found invitation:", data);
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
