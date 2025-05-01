
import { supabase } from '@/integrations/supabase/client';
import { InvitationDbRecord, InvitationData, SimpleInvitationResult } from './invitation-types';
import { SimpleInvitation } from '@/types/invitation.types';

/**
 * Create a new simple invitation
 * @param data The invitation data to create
 * @returns The created invitation or null if creation failed
 */
export async function createSimpleInvitation(data: Partial<InvitationData>): Promise<SimpleInvitation | null> {
  try {
    // Insert the new invitation
    const { data: newInvitation, error } = await supabase
      .from('invitations')
      .insert([data as InvitationData])
      .select()
      .single();

    if (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }

    if (!newInvitation) {
      return null;
    }

    // Map the database record to our frontend model
    const record = newInvitation as InvitationDbRecord;
    
    // Extract date and time from datetime if available
    let date: string | undefined;
    let time: string | undefined;
    if (record.datetime) {
      const dateObj = new Date(record.datetime);
      date = dateObj.toISOString().split('T')[0];
      time = dateObj.toTimeString().slice(0, 5); // Format as HH:MM
    }

    // Map to SimpleInvitation with explicit property assignments
    const invitation: SimpleInvitation = {
      id: record.id,
      title: record.title,
      description: record.description,
      location: record.location || '',
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
          type: record.background_type as any,
          value: record.background_value,
        },
        font: {
          family: record.font_family,
          size: record.font_size,
          color: record.text_color,
          alignment: record.text_align,
          weight: 'normal', // Default value as it's not stored in DB
        }
      }
    };

    return invitation;
  } catch (error) {
    console.error('Error in createSimpleInvitation:', error);
    throw error;
  }
}

/**
 * Update an existing simple invitation
 * @param id The ID of the invitation to update
 * @param data The data to update
 * @returns The updated invitation or null if update failed
 */
export async function updateSimpleInvitation(id: string, data: Partial<InvitationData>): Promise<SimpleInvitation | null> {
  try {
    // Update the invitation
    const { data: updatedInvitation, error } = await supabase
      .from('invitations')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating invitation:', error);
      throw error;
    }

    if (!updatedInvitation) {
      return null;
    }

    // Map the database record to our frontend model
    const record = updatedInvitation as InvitationDbRecord;
    
    // Extract date and time from datetime if available
    let date: string | undefined;
    let time: string | undefined;
    if (record.datetime) {
      const dateObj = new Date(record.datetime);
      date = dateObj.toISOString().split('T')[0];
      time = dateObj.toTimeString().slice(0, 5); // Format as HH:MM
    }

    // Map to SimpleInvitation with explicit property assignments
    const invitation: SimpleInvitation = {
      id: record.id,
      title: record.title,
      description: record.description,
      location: record.location || '',
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
          type: record.background_type as any,
          value: record.background_value,
        },
        font: {
          family: record.font_family,
          size: record.font_size,
          color: record.text_color,
          alignment: record.text_align,
          weight: 'normal', // Default value as it's not stored in DB
        }
      }
    };

    return invitation;
  } catch (error) {
    console.error('Error in updateSimpleInvitation:', error);
    throw error;
  }
}

/**
 * Delete a simple invitation
 * @param id The ID of the invitation to delete
 * @returns true if deletion was successful, false otherwise
 */
export async function deleteSimpleInvitation(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting invitation:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteSimpleInvitation:', error);
    throw error;
  }
}

/**
 * Get a simple invitation by ID
 * @param id The ID of the invitation to retrieve
 * @returns The invitation or null if not found
 */
export async function getSimpleInvitationById(id: string): Promise<SimpleInvitation | null> {
  try {
    const { data: invitation, error } = await supabase
      .from('invitations')
      .select()
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching invitation:', error);
      throw error;
    }

    if (!invitation) {
      return null;
    }

    // Map the database record to our frontend model
    const record = invitation as InvitationDbRecord;
    
    // Extract date and time from datetime if available
    let date: string | undefined;
    let time: string | undefined;
    if (record.datetime) {
      const dateObj = new Date(record.datetime);
      date = dateObj.toISOString().split('T')[0];
      time = dateObj.toTimeString().slice(0, 5); // Format as HH:MM
    }

    // Map to SimpleInvitation with explicit property assignments
    const result: SimpleInvitation = {
      id: record.id,
      title: record.title,
      description: record.description,
      location: record.location || '',
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
          type: record.background_type as any,
          value: record.background_value,
        },
        font: {
          family: record.font_family,
          size: record.font_size,
          color: record.text_color,
          alignment: record.text_align,
          weight: 'normal', // Default value as it's not stored in DB
        }
      }
    };

    return result;
  } catch (error) {
    console.error('Error in getSimpleInvitationById:', error);
    throw error;
  }
}

/**
 * Get a shared invitation by share ID
 * @param shareId The sharing ID of the invitation
 * @returns The invitation or null if not found
 */
export async function getSharedInvitation(shareId: string): Promise<SimpleInvitation | null> {
  try {
    const { data: invitation, error } = await supabase
      .from('invitations')
      .select()
      .eq('share_id', shareId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching shared invitation:', error);
      throw error;
    }

    if (!invitation) {
      return null;
    }

    // Map the database record to our frontend model
    const record = invitation as InvitationDbRecord;
    
    // Extract date and time from datetime if available
    let date: string | undefined;
    let time: string | undefined;
    if (record.datetime) {
      const dateObj = new Date(record.datetime);
      date = dateObj.toISOString().split('T')[0];
      time = dateObj.toTimeString().slice(0, 5); // Format as HH:MM
    }

    // Map to SimpleInvitation with explicit property assignments
    const result: SimpleInvitation = {
      id: record.id,
      title: record.title,
      description: record.description,
      location: record.location || '',
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
          type: record.background_type as any,
          value: record.background_value,
        },
        font: {
          family: record.font_family,
          size: record.font_size,
          color: record.text_color,
          alignment: record.text_align,
          weight: 'normal', // Default value as it's not stored in DB
        }
      }
    };

    return result;
  } catch (error) {
    console.error('Error in getSharedInvitation:', error);
    throw error;
  }
}

/**
 * Fetch all simple invitations for the current user
 * @param isEvents If true, only events are returned, if false, only non-events are returned
 * @returns Array of simple invitations
 */
export async function fetchSimpleInvitations(isEvents?: boolean): Promise<SimpleInvitation[]> {
  try {
    let query = supabase
      .from('invitations')
      .select();
      
    // Filter by event type if specified
    if (typeof isEvents === 'boolean') {
      query = query.eq('is_event', isEvents);
    }
    
    const { data: invitations, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invitations:', error);
      throw error;
    }

    if (!invitations || invitations.length === 0) {
      return [];
    }

    // Map the database records to our frontend model
    return invitations.map((record: InvitationDbRecord) => {
      // Extract date and time from datetime if available
      let date: string | undefined;
      let time: string | undefined;
      if (record.datetime) {
        const dateObj = new Date(record.datetime);
        date = dateObj.toISOString().split('T')[0];
        time = dateObj.toTimeString().slice(0, 5); // Format as HH:MM
      }

      // Map to SimpleInvitation with explicit property assignments
      return {
        id: record.id,
        title: record.title,
        description: record.description,
        location: record.location || '',
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
            type: record.background_type as any,
            value: record.background_value,
          },
          font: {
            family: record.font_family,
            size: record.font_size,
            color: record.text_color,
            alignment: record.text_align,
            weight: 'normal', // Default value as it's not stored in DB
          }
        }
      };
    });
  } catch (error) {
    console.error('Error in fetchSimpleInvitations:', error);
    throw error;
  }
}
