
import { supabase } from '@/integrations/supabase/client';
import { InvitationDbRecord } from './invitation-types';
import { SimpleInvitation } from '@/types/invitation.types';
import { mapDbRecordToSimpleInvitation } from './invitation-mapper';

/**
 * Fetch all simple invitations for a user
 */
export async function fetchSimpleInvitations(userId: string, isEvent?: boolean): Promise<SimpleInvitation[]> {
  try {
    console.log(`[fetchSimpleInvitations] Fetching ${isEvent ? 'events' : 'invitations'} for user:`, userId);
    
    if (!userId) {
      console.warn('[fetchSimpleInvitations] No userId provided, returning empty array');
      return [];
    }
    
    // Start with the base query
    let query = supabase
      .from('invitations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    // Add event filter if specified
    if (isEvent !== undefined) {
      query = query.eq('is_event', isEvent);
    }
    
    const { data: records, error } = await query;
      
    if (error) {
      console.error('[fetchSimpleInvitations] Error:', error);
      throw error;
    }
    
    console.log('[fetchSimpleInvitations] Fetched invitations:', records?.length || 0);
    
    // Process records with explicit typing to avoid deep instantiation errors
    const invitations: SimpleInvitation[] = [];
    
    if (records && records.length > 0) {
      for (const record of records) {
        const typedRecord = record as InvitationDbRecord;
        const invitation = mapDbRecordToSimpleInvitation(typedRecord);
        if (invitation) {
          invitations.push(invitation);
        }
      }
    }
    
    return invitations;
  } catch (error) {
    console.error('[fetchSimpleInvitations] Error fetching invitations:', error);
    return [];
  }
}

/**
 * Alias for backward compatibility
 */
export const listSimpleInvitations = fetchSimpleInvitations;
