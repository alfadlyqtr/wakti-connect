
import { supabase } from '@/integrations/supabase/client';
import { InvitationDbRecord } from './invitation-types';
import { SimpleInvitation } from '@/types/invitation.types';
import { mapDbRecordToSimpleInvitation } from './invitation-crud';

/**
 * Fetch a list of simple invitations for a user
 */
export async function fetchSimpleInvitations(userId: string, isEvent = false): Promise<SimpleInvitation[]> {
  try {
    console.log('[fetchSimpleInvitations] Fetching invitations for user:', userId, 'isEvent:', isEvent);
    
    const { data: records, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_event', isEvent)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('[fetchSimpleInvitations] Error:', error);
      throw error;
    }
    
    console.log('[fetchSimpleInvitations] Fetched invitations:', records?.length);
    // Map each record to a SimpleInvitation object
    return (records || []).map(record => mapDbRecordToSimpleInvitation(record as InvitationDbRecord));
  } catch (error) {
    console.error('[fetchSimpleInvitations] Error fetching invitations:', error);
    return [];
  }
}

/**
 * List all simple invitations for a user - alias for fetchSimpleInvitations
 */
export const listSimpleInvitations = fetchSimpleInvitations;
