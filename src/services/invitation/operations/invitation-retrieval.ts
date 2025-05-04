
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
    
    // Set isEvent flag if the invitation has a datetime
    if (data.datetime && !data.is_event) {
      console.log("This invitation has a datetime but is not marked as an event, fixing this...");
      
      // Update the record to mark it as an event
      const { error: updateError } = await supabase
        .from('invitations')
        .update({ is_event: true })
        .eq('id', data.id);
        
      if (updateError) {
        console.error("Error updating invitation is_event flag:", updateError);
      } else {
        // Update local data as well
        data.is_event = true;
      }
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
 * Retrieve all invitations for the current user
 * @param isEvent Optional filter to only return events
 */
export const fetchSimpleInvitations = async (isEvent = false): Promise<SimpleInvitation[]> => {
  try {
    console.log("Fetching invitations with isEvent filter:", isEvent);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No authenticated session');
    }

    let query = supabase
      .from('invitations')
      .select('*')
      .eq('user_id', session.user.id);
    
    // For events query, also include items with dates regardless of is_event flag
    if (isEvent) {
      query = query.or(`is_event.eq.true,datetime.not.is.null`);
    }
    // When not filtering for events, don't need special handling
    else if (isEvent === false) {
      // Do nothing - we'll get all invitations without filtering
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    
    console.log(`Found ${data.length} invitations`);

    // Auto-fix: Mark any invitation with a datetime as an event
    for (const invitation of data) {
      if (invitation.datetime && !invitation.is_event) {
        console.log(`Fixing invitation ${invitation.id}: has datetime but no is_event flag`);
        
        // Update the record to mark it as an event
        const { error: updateError } = await supabase
          .from('invitations')
          .update({ is_event: true })
          .eq('id', invitation.id);
          
        if (updateError) {
          console.error("Error updating invitation is_event flag:", updateError);
        } else {
          // Update local data as well
          invitation.is_event = true;
        }
      }
    }

    const mappedData = data.map(mapDbRecordToSimpleInvitation).filter(Boolean) as SimpleInvitation[];
    console.log(`Returning ${mappedData.length} mapped invitations`);
    return mappedData;
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
