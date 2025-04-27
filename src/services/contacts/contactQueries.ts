
import { supabase } from '@/integrations/supabase/client';
import { UserContact, ContactRequestStatusValue, UserSearchResult } from '@/types/invitation.types';

/**
 * Get regular contacts for a user (excluding staff contacts)
 */
export const getUserContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    console.log('[ContactQueries] Fetching contacts for user:', userId);
    
    const { data: contactRows, error } = await supabase
      .from('user_contacts')
      .select(`
        id,
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at,
        contact_profile:profiles!contact_id(
          id,
          full_name,
          display_name,
          avatar_url,
          account_type,
          business_name,
          email
        )
      `)
      .or(`user_id.eq.${userId},contact_id.eq.${userId}`)
      .eq('status', 'accepted')
      .is('staff_relation_id', null);

    if (error) {
      console.error('[ContactQueries] Database error:', error);
      return [];
    }

    if (!contactRows?.length) {
      console.log('[ContactQueries] No contacts found for user:', userId);
      return [];
    }

    console.log('[ContactQueries] Found contacts:', contactRows);

    // Transform results to match the UserContact type
    return contactRows.map(row => {
      const isReversed = row.contact_id === userId;
      const contactProfile = row.contact_profile;
      const actualContactId = isReversed ? row.user_id : row.contact_id;
      
      if (!contactProfile) {
        console.warn(`[ContactQueries] Missing profile for contact ID: ${actualContactId}`);
      }

      return {
        id: row.id,
        userId: row.user_id,
        contactId: actualContactId,
        status: row.status as ContactRequestStatusValue,
        staffRelationId: row.staff_relation_id,
        created_at: row.created_at,
        contactProfile: contactProfile ? {
          id: actualContactId,
          fullName: contactProfile.full_name || 'Unknown User',
          displayName: contactProfile.display_name || contactProfile.full_name || 'Unknown User',
          avatarUrl: contactProfile.avatar_url,
          accountType: contactProfile.account_type || 'free',
          businessName: contactProfile.business_name,
          email: contactProfile.email
        } : {
          id: actualContactId,
          fullName: 'Unknown User',
          displayName: 'Unknown User',
          accountType: 'free'
        }
      };
    });
  } catch (error) {
    console.error('[ContactQueries] Unexpected error:', error);
    return [];
  }
};

/**
 * Simple direct search for users by name, email, or phone
 */
export const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
  try {
    if (!query || query.length < 2) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        display_name,
        email,
        avatar_url,
        account_type,
        business_name
      `)
      .or(`
        display_name.ilike.%${query}%,
        full_name.ilike.%${query}%,
        email.ilike.%${query}%
      `)
      .eq('is_searchable', true)
      .limit(10);

    if (error) {
      console.error('[ContactSearch] Error searching users:', error);
      return [];
    }

    return data.map(user => ({
      id: user.id,
      fullName: user.full_name,
      displayName: user.display_name,
      email: user.email,
      avatarUrl: user.avatar_url,
      accountType: user.account_type,
      businessName: user.business_name
    }));
  } catch (error) {
    console.error('[ContactSearch] Unexpected error:', error);
    return [];
  }
};

/**
 * These are placeholder exports to satisfy the index.ts imports
 * They should be implemented or removed from the index exports
 */
export const getContactRequests = async () => {
  console.warn('getContactRequests is not fully implemented');
  return { incoming: [], outgoing: [] };
};

export const getStaffContacts = async () => {
  console.warn('getStaffContacts is not fully implemented');
  return [];
};
