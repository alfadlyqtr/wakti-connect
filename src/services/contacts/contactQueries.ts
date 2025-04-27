
import { supabase } from '@/integrations/supabase/client';
import { UserContact } from '@/types/invitation.types';

/**
 * Get regular contacts for a user (excluding staff contacts)
 */
export const getUserContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    console.log('[ContactQueries] Fetching contacts for user:', userId);
    
    const { data: contacts, error } = await supabase
      .from('user_contacts')
      .select(`
        id,
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at,
        contact:contact_id (
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

    if (!contacts?.length) {
      console.log('[ContactQueries] No contacts found for user:', userId);
      return [];
    }

    console.log('[ContactQueries] Found contacts:', contacts);

    return contacts.map(contact => {
      const isReversed = contact.contact_id === userId;
      const contactData = contact.contact;
      const actualContactId = isReversed ? contact.user_id : contact.contact_id;

      return {
        id: contact.id,
        userId: contact.user_id,
        contactId: actualContactId,
        status: contact.status,
        staffRelationId: contact.staff_relation_id,
        created_at: contact.created_at,
        contactProfile: {
          id: actualContactId,
          fullName: contactData?.full_name || 'Unknown User',
          displayName: contactData?.display_name || contactData?.full_name || 'Unknown User',
          avatarUrl: contactData?.avatar_url,
          accountType: contactData?.account_type || 'free',
          businessName: contactData?.business_name,
          email: contactData?.email
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
