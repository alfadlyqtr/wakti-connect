
import { supabase } from '@/lib/supabase';
import { UserSearchResult, ContactRequestStatus, ContactRequestStatusValue } from '@/types/invitation.types';

export const searchUsers = async (searchTerm: string): Promise<UserSearchResult[]> => {
  try {
    if (!searchTerm.trim()) {
      return [];
    }
    
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to search users');
    }
    
    // Using a clean, optimized query to search users
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, display_name, email, avatar_url, account_type, business_name')
      .or(`full_name.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,business_name.ilike.%${searchTerm}%`)
      .neq('id', session.session.user.id)
      .eq('is_searchable', true)
      .limit(10);
    
    if (error) {
      console.error('Error searching users:', error);
      throw new Error(error.message);
    }
    
    if (!Array.isArray(data)) {
      return [];
    }
    
    return data.map((user) => ({
      id: user.id,
      fullName: user.full_name,
      displayName: user.display_name,
      email: user.email,
      avatarUrl: user.avatar_url,
      accountType: user.account_type,
      businessName: user.business_name
    }));
  } catch (error) {
    console.error('Error in searchUsers:', error);
    throw error;
  }
};

export const checkContactRequest = async (contactId: string): Promise<ContactRequestStatus> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to check contact status');
    }
    
    const currentUserId = session.session.user.id;
    
    // Direct query to check if a contact request exists in either direction
    const { data, error } = await supabase
      .from('user_contacts')
      .select('id, status')
      .or(`and(user_id.eq.${currentUserId},contact_id.eq.${contactId}),and(user_id.eq.${contactId},contact_id.eq.${currentUserId})`)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking contact request:', error);
      throw new Error(error.message);
    }
    
    if (!data) {
      return { requestExists: false, requestStatus: 'none' };
    }
    
    // Make sure we only return valid status values
    const validStatus = (data.status === 'accepted' || data.status === 'pending' || data.status === 'rejected') 
      ? data.status as ContactRequestStatusValue
      : 'none' as ContactRequestStatusValue;
    
    return {
      requestExists: true,
      requestStatus: validStatus
    };
  } catch (error) {
    console.error('Error in checkContactRequest:', error);
    throw error;
  }
};
