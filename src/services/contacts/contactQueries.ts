
import { supabase } from '@/integrations/supabase/client';
import { UserContact } from '@/types/invitation.types';

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
        profiles:contact_id(
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
      throw new Error(error.message);
    }
    
    // Transform the data to match the UserContact interface
    return data.map((contact) => ({
      id: contact.id,
      userId: contact.user_id,
      contactId: contact.contact_id,
      status: contact.status,
      staffRelationId: contact.staff_relation_id,
      contactProfile: {
        id: contact.profiles?.id || '',
        fullName: contact.profiles?.full_name || '',
        displayName: contact.profiles?.display_name || '',
        avatarUrl: contact.profiles?.avatar_url || '',
        accountType: contact.profiles?.account_type || 'free'
      }
    }));
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
        profiles:user_id(
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
      throw new Error(error.message);
    }
    
    // Transform the data to match the UserContact interface
    return data.map((contact) => ({
      id: contact.id,
      userId: contact.user_id,
      contactId: contact.contact_id,
      status: contact.status,
      contactProfile: {
        id: contact.profiles?.id || '',
        fullName: contact.profiles?.full_name || '',
        displayName: contact.profiles?.display_name || '',
        avatarUrl: contact.profiles?.avatar_url || '',
        accountType: contact.profiles?.account_type || 'free'
      }
    }));
  } catch (error) {
    console.error('Error in getContactRequests:', error);
    throw error;
  }
};

export const checkContactRequestStatus = async (contactId: string): Promise<{ requestExists: boolean; requestStatus: string }> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to check contact status');
    }
    
    const userId = session.session.user.id;
    
    const { data, error } = await supabase
      .from('user_contacts')
      .select('id, status')
      .or(`and(user_id.eq.${userId},contact_id.eq.${contactId}),and(user_id.eq.${contactId},contact_id.eq.${userId})`)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No results found
        return {
          requestExists: false,
          requestStatus: 'none'
        };
      }
      console.error('Error checking contact request status:', error);
      throw new Error(error.message);
    }
    
    return {
      requestExists: true,
      requestStatus: data?.status || 'none'
    };
  } catch (error) {
    console.error('Error in checkContactRequestStatus:', error);
    if (error instanceof Error && error.message.includes('single row')) {
      return {
        requestExists: false,
        requestStatus: 'none'
      };
    }
    throw error;
  }
};
