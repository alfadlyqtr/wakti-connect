
import { supabase } from '@/integrations/supabase/client';
import { UserContact } from '@/types/invitation.types';

/**
 * Get regular contacts for a user (excluding staff contacts)
 */
export const getUserContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    console.log('[ContactQueries] Fetching regular contacts for user:', userId);
    
    // Get user's contacts with accepted status, excluding staff contacts, in both directions
    const { data: contacts, error } = await supabase
      .from('user_contacts')
      .select(`
        id,
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at,
        profiles:contact_id (
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
      .is('staff_relation_id', null); // Only get regular contacts, not staff-related
    
    if (error) {
      console.error('[ContactQueries] Error fetching regular user contacts:', error);
      return [];
    }
    
    console.log(`[ContactQueries] Found ${contacts?.length || 0} regular contacts:`, contacts);
    
    // Transform the data to match our types, handling both directions
    const userContacts = contacts.map(contact => {
      // Determine if this contact is from user_id -> contact_id or contact_id -> user_id
      const isReversed = contact.contact_id === userId;
      const contactData = (contact.profiles || {}) as any;
      
      // If reversed, we need to use the user_id as the contact's ID
      const actualContactId = isReversed ? contact.user_id : contact.contact_id;
      
      const contactProfile = {
        id: contactData.id || actualContactId,
        fullName: contactData.full_name || null,
        displayName: contactData.display_name || null,
        avatarUrl: contactData.avatar_url || null,
        accountType: contactData.account_type || null,
        businessName: contactData.business_name || null,
        email: contactData.email || null
      };
      
      return {
        id: contact.id,
        userId: contact.user_id,
        contactId: actualContactId,
        status: contact.status as "accepted" | "pending" | "rejected",
        staffRelationId: contact.staff_relation_id,
        created_at: contact.created_at,
        contactProfile
      };
    });
    
    console.log('[ContactQueries] Transformed regular contacts:', userContacts);
    return userContacts;
  } catch (error) {
    console.error('[ContactQueries] Error in getUserContacts:', error);
    return [];
  }
};

/**
 * Get staff-related contacts for a user
 */
export const getStaffContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    console.log('[ContactQueries] Fetching staff contacts for user:', userId);
    
    // Get user's contacts with accepted status that are staff-related
    const { data: contacts, error } = await supabase
      .from('user_contacts')
      .select(`
        id,
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at,
        profiles:contact_id (
          id,
          full_name,
          display_name,
          avatar_url,
          account_type,
          business_name,
          email
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted')
      .not('staff_relation_id', 'is', null); // Only get staff-related contacts
    
    if (error) {
      console.error('[ContactQueries] Error fetching staff contacts:', error);
      return [];
    }
    
    console.log(`[ContactQueries] Found ${contacts?.length || 0} staff contacts:`, contacts);
    
    // Transform the data to match our types
    const userContacts = contacts.map(contact => {
      const contactData = (contact.profiles || {}) as any;
      
      const contactProfile = {
        id: contactData.id || contact.contact_id,
        fullName: contactData.full_name || null,
        displayName: contactData.display_name || null,
        avatarUrl: contactData.avatar_url || null,
        accountType: contactData.account_type || null,
        businessName: contactData.business_name || null,
        email: contactData.email || null
      };
      
      return {
        id: contact.id,
        userId: contact.user_id,
        contactId: contact.contact_id,
        status: contact.status as "accepted" | "pending" | "rejected",
        staffRelationId: contact.staff_relation_id,
        created_at: contact.created_at,
        contactProfile
      };
    });
    
    console.log('[ContactQueries] Transformed staff contacts:', userContacts);
    return userContacts;
  } catch (error) {
    console.error('[ContactQueries] Error in getStaffContacts:', error);
    return [];
  }
};

/**
 * Get all pending contact requests for a user
 */
export const getContactRequests = async (userId: string): Promise<UserContact[]> => {
  try {
    console.log('[ContactQueries] Fetching contact requests for user:', userId);
    
    // Use the get_contact_requests database function
    const { data: requests, error } = await supabase
      .rpc('get_contact_requests', {
        request_user_id: userId
      });
    
    if (error) {
      console.error('[ContactQueries] Error fetching contact requests:', error);
      return [];
    }
    
    console.log('[ContactQueries] Raw pending requests:', requests);

    // Transform and validate each contact to match our UserContact interface
    const validRequests = (requests || [])
      .filter(request => {
        // Filter out invalid requests
        return request && request.user_id && request.contact_profile;
      })
      .map(request => {
        // Transform from snake_case to camelCase
        return {
          id: request.id,
          userId: request.user_id, // Transform to camelCase
          contactId: request.contact_id, // Transform to camelCase
          status: request.status as "accepted" | "pending" | "rejected",
          staffRelationId: request.staff_relation_id,
          created_at: request.created_at,
          contactProfile: request.contact_profile
        } as UserContact;
      });
    
    console.log('[ContactQueries] Transformed contact requests:', validRequests);
    return validRequests;
  } catch (error) {
    console.error('[ContactQueries] Error in getContactRequests:', error);
    return [];
  }
};
