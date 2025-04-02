
import { supabase } from '@/lib/supabase';
import { UserSearchResult, ContactRequestStatus } from '@/types/invitation.types';
import { formatErrorMessage } from '@/lib/utils';

export const searchUsers = async (searchTerm: string): Promise<UserSearchResult[]> => {
  try {
    if (!searchTerm.trim()) {
      return [];
    }
    
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to search users');
    }
    
    // Using RPC function for search instead
    const { data, error } = await supabase.rpc('search_public_profiles', {
      search_term: searchTerm.toLowerCase(),
      current_user_id: session.session.user.id
    });
    
    if (error) {
      console.error('Error searching users:', error);
      throw new Error(formatErrorMessage(error));
    }
    
    if (!Array.isArray(data)) {
      return [];
    }
    
    return data.map((user: any) => ({
      id: user.id,
      fullName: user.full_name,
      displayName: user.display_name,
      email: user.email,
      avatarUrl: user.avatar_url,
      accountType: user.account_type
    }));
  } catch (error) {
    console.error('Error in searchUsers:', error);
    throw error;
  }
};

export const checkContactRequest = async (userId: string): Promise<ContactRequestStatus> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to check contact status');
    }
    
    const currentUserId = session.session.user.id;
    
    // Using RPC function for checking contact request
    const { data, error } = await supabase.rpc('check_contact_status', {
      user_id_1: currentUserId,
      user_id_2: userId
    });
    
    if (error) {
      console.error('Error checking contact request:', error);
      throw new Error(formatErrorMessage(error));
    }
    
    if (!data) {
      return { requestExists: false, requestStatus: 'none' };
    }
    
    return {
      requestExists: !!data.exists,
      requestStatus: data.status || 'none'
    };
  } catch (error) {
    console.error('Error in checkContactRequest:', error);
    throw error;
  }
};
