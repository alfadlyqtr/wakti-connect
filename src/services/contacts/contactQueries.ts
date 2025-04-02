
import { supabase } from '@/integrations/supabase/client';
import { UserContact } from '@/types/invitation.types';

/**
 * Get all contacts for a user
 */
export const getUserContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    // Get all user's contacts with accepted status
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
          account_type,
          business_name,
          email
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted');
    
    if (error) {
      console.error('Error fetching user contacts:', error);
      return [];
    }
    
    // Transform the data to match our types
    const userContacts = contacts.map(contact => {
      // Explicitly cast contact.contact to any to avoid TypeScript errors
      const contactData = (contact.contact || {}) as any;
      
      // Make sure contact exists and has necessary properties
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
        contactProfile
      };
    });
    
    return userContacts;
  } catch (error) {
    console.error('Error in getUserContacts:', error);
    return [];
  }
};

/**
 * Get all pending contact requests for a user
 */
export const getContactRequests = async (userId: string): Promise<UserContact[]> => {
  try {
    // Get all users who have this user as a contact with pending status
    const { data: contacts, error } = await supabase
      .from('user_contacts')
      .select(`
        id,
        user_id,
        contact_id,
        status,
        staff_relation_id,
        contact:user_id (
          id,
          full_name,
          display_name,
          avatar_url,
          account_type,
          business_name,
          email
        )
      `)
      .eq('contact_id', userId)
      .eq('status', 'pending');
    
    if (error) {
      console.error('Error fetching contact requests:', error);
      return [];
    }
    
    // Transform the data to match our types
    const userContacts = contacts.map(contact => {
      // Explicitly cast contact.contact to any to avoid TypeScript errors
      const contactData = (contact.contact || {}) as any;
      
      // Make sure contact exists and has necessary properties
      const contactProfile = {
        id: contactData.id || contact.user_id,
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
        contactProfile
      };
    });
    
    return userContacts;
  } catch (error) {
    console.error('Error in getContactRequests:', error);
    return [];
  }
};
