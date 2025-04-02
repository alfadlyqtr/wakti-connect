import { supabase } from '@/lib/supabase';
import { UserContact } from '@/types/contact.types';

/**
 * Get all contacts for a user
 */
export const getUserContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    // Get all user's contacts
    const { data: contacts, error } = await supabase
      .from('user_contacts')
      .select(`
        id,
        user_id,
        contact_id,
        status,
        staff_relation_id,
        contact:contact_id (
          id,
          full_name,
          display_name,
          avatar_url,
          account_type
        )
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user contacts:', error);
      return [];
    }
    
    // Transform the data to match our types
    const userContacts = contacts.map(contact => {
      // Handle possible null values in contact data
      const contactProfile = contact.contact || {
        id: null,
        full_name: null,
        display_name: null,
        avatar_url: null,
        account_type: null
      };
      
      return {
        id: contact.id,
        userId: contact.user_id,
        contactId: contact.contact_id,
        status: contact.status as "accepted" | "pending" | "rejected",
        staffRelationId: contact.staff_relation_id,
        contactProfile: {
          id: contactProfile.id,
          fullName: contactProfile.full_name,
          displayName: contactProfile.display_name,
          avatarUrl: contactProfile.avatar_url,
          accountType: contactProfile.account_type
        }
      };
    });
    
    return userContacts;
  } catch (error) {
    console.error('Error in getUserContacts:', error);
    return [];
  }
};

/**
 * Get all contacts who have the user as a contact
 */
export const getReversedUserContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    // Get all users who have this user as a contact
    const { data: contacts, error } = await supabase
      .from('user_contacts')
      .select(`
        id,
        user_id,
        contact_id,
        status,
        contact:user_id (
          id,
          full_name,
          display_name,
          avatar_url,
          account_type
        )
      `)
      .eq('contact_id', userId);
    
    if (error) {
      console.error('Error fetching reversed user contacts:', error);
      return [];
    }
    
    // Transform the data to match our types
    const userContacts = contacts.map(contact => {
      // Handle possible null values in contact data
      const contactProfile = contact.contact || {
        id: null,
        full_name: null,
        display_name: null,
        avatar_url: null,
        account_type: null
      };
      
      return {
        id: contact.id,
        userId: contact.user_id,
        contactId: contact.contact_id,
        status: contact.status as "accepted" | "pending" | "rejected",
        contactProfile: {
          id: contactProfile.id,
          fullName: contactProfile.full_name,
          displayName: contactProfile.display_name,
          avatarUrl: contactProfile.avatar_url,
          accountType: contactProfile.account_type
        }
      };
    });
    
    return userContacts;
  } catch (error) {
    console.error('Error in getReversedUserContacts:', error);
    return [];
  }
};
