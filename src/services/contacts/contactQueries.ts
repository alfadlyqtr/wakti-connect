
import { supabase } from '@/lib/supabase';
import { UserContact, ContactRequestStatus } from '@/types/invitation.types';
import { formatErrorMessage } from '@/lib/utils';

export const getUserContacts = async (): Promise<UserContact[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to view contacts');
    }
    
    const { data, error } = await supabase
      .from('user_contacts')
      .select(`
        id,
        user_id,
        contact_id,
        status,
        staff_relation_id,
        contactProfile:contact_id(
          id,
          full_name,
          display_name,
          avatar_url,
          account_type
        )
      `)
      .eq('user_id', session.session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user contacts:', error);
      throw new Error(formatErrorMessage(error));
    }
    
    // Transform the data to match the UserContact interface
    return data.map(contact => ({
      id: contact.id,
      userId: contact.user_id,
      contactId: contact.contact_id,
      status: contact.status as 'pending' | 'accepted' | 'rejected',
      staffRelationId: contact.staff_relation_id,
      contactProfile: {
        id: contact.contactProfile?.id || '',
        fullName: contact.contactProfile?.full_name || '',
        displayName: contact.contactProfile?.display_name || '',
        avatarUrl: contact.contactProfile?.avatar_url || '',
        accountType: contact.contactProfile?.account_type || 'free'
      }
    })) as UserContact[];
  } catch (error) {
    console.error('Error in getUserContacts:', error);
    throw error;
  }
};

export const getContactRequests = async (): Promise<UserContact[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to view contact requests');
    }
    
    const { data, error } = await supabase
      .from('user_contacts')
      .select(`
        id,
        user_id,
        contact_id,
        status,
        contactProfile:user_id(
          id,
          full_name,
          display_name,
          avatar_url,
          account_type
        )
      `)
      .eq('contact_id', session.session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contact requests:', error);
      throw new Error(formatErrorMessage(error));
    }
    
    // Transform the data to match the UserContact interface
    return data.map(contact => ({
      id: contact.id,
      userId: contact.user_id,
      contactId: contact.contact_id,
      status: contact.status as 'pending' | 'accepted' | 'rejected',
      contactProfile: {
        id: contact.contactProfile?.id || '',
        fullName: contact.contactProfile?.full_name || '',
        displayName: contact.contactProfile?.display_name || '',
        avatarUrl: contact.contactProfile?.avatar_url || '',
        accountType: contact.contactProfile?.account_type || 'free'
      }
    })) as UserContact[];
  } catch (error) {
    console.error('Error in getContactRequests:', error);
    throw error;
  }
};

export const checkContactRequestStatus = async (contactId: string): Promise<ContactRequestStatus> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to check contact status');
    }
    
    const userId = session.session.user.id;
    
    const { data, error } = await supabase
      .from('user_contacts')
      .select('id, status')
      .or(`user_id.eq.${userId},contact_id.eq.${userId}`)
      .or(`user_id.eq.${contactId},contact_id.eq.${contactId}`)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No results found
        return { requestExists: false, requestStatus: 'none' };
      }
      console.error('Error checking contact request status:', error);
      throw new Error(formatErrorMessage(error));
    }
    
    return {
      requestExists: true,
      requestStatus: data?.status || 'none'
    };
  } catch (error) {
    console.error('Error in checkContactRequestStatus:', error);
    if (error instanceof Error && error.message.includes('single row')) {
      return { requestExists: false, requestStatus: 'none' };
    }
    throw error;
  }
};
