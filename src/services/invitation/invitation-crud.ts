
import { supabase } from '@/integrations/supabase/client';
import { InvitationDbRecord, InvitationData } from './invitation-types';
import { SimpleInvitation } from '@/types/invitation.types';
import { mapDbRecordToSimpleInvitation } from './invitation-mapper';

/**
 * Create a new simple invitation
 */
export async function createSimpleInvitation(data: InvitationData): Promise<SimpleInvitation | null> {
  try {
    console.log('[createSimpleInvitation] Creating invitation with data:', data);
    
    const { data: record, error } = await supabase
      .from('invitations')
      .insert([data])
      .select('*')
      .single();
      
    if (error) {
      console.error('[createSimpleInvitation] Error:', error);
      throw error;
    }
    
    console.log('[createSimpleInvitation] Created invitation:', record);
    // Use the mapper function to create the SimpleInvitation object
    return mapDbRecordToSimpleInvitation(record as InvitationDbRecord);
  } catch (error) {
    console.error('[createSimpleInvitation] Error creating invitation:', error);
    return null;
  }
}

/**
 * Update an existing simple invitation
 */
export async function updateSimpleInvitation(id: string, data: Partial<InvitationData>): Promise<SimpleInvitation | null> {
  try {
    console.log('[updateSimpleInvitation] Updating invitation:', id, data);
    
    const { data: record, error } = await supabase
      .from('invitations')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      console.error('[updateSimpleInvitation] Error:', error);
      throw error;
    }
    
    console.log('[updateSimpleInvitation] Updated invitation:', record);
    // Use the mapper function to create the SimpleInvitation object
    return mapDbRecordToSimpleInvitation(record as InvitationDbRecord);
  } catch (error) {
    console.error('[updateSimpleInvitation] Error updating invitation:', error);
    return null;
  }
}

/**
 * Get a simple invitation by ID
 */
export async function getSimpleInvitationById(id: string): Promise<SimpleInvitation | null> {
  try {
    console.log('[getSimpleInvitationById] Getting invitation:', id);
    
    const { data: record, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('[getSimpleInvitationById] Error:', error);
      throw error;
    }
    
    console.log('[getSimpleInvitationById] Got invitation:', record);
    // Use the mapper function to create the SimpleInvitation object
    return mapDbRecordToSimpleInvitation(record as InvitationDbRecord);
  } catch (error) {
    console.error('[getSimpleInvitationById] Error getting invitation:', error);
    return null;
  }
}

/**
 * Get a shared invitation by its share ID
 */
export async function getSharedInvitation(shareId: string): Promise<SimpleInvitation | null> {
  try {
    console.log('[getSharedInvitation] Getting shared invitation:', shareId);
    
    const { data: record, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('share_id', shareId)
      .single();
      
    if (error) {
      console.error('[getSharedInvitation] Error:', error);
      throw error;
    }
    
    console.log('[getSharedInvitation] Got shared invitation:', record);
    // Use the mapper function to create the SimpleInvitation object
    return mapDbRecordToSimpleInvitation(record as InvitationDbRecord);
  } catch (error) {
    console.error('[getSharedInvitation] Error getting shared invitation:', error);
    return null;
  }
}
