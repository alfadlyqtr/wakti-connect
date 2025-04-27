
import { supabase } from '@/integrations/supabase/client';
import { UserSearchResult, ContactRequestStatus, ContactRequestStatusValue } from '@/types/invitation.types';

export const searchUsers = async (searchTerm: string): Promise<UserSearchResult[]> => {
  try {
    // Early validation to prevent empty searches
    if (!searchTerm || !searchTerm.trim()) {
      console.log("[searchUsers] Empty search term, returning empty array");
      return [];
    }
    
    // Get the current user's session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      console.error("[searchUsers] No session found");
      throw new Error('You must be logged in to search users');
    }
    
    const currentUserId = session.session.user.id;
    console.log(`[searchUsers] Searching for "${searchTerm}" by user ${currentUserId}`);
    
    // Using a clean, optimized query to search users
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, display_name, email, avatar_url, account_type, business_name')
      .or(`full_name.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,business_name.ilike.%${searchTerm}%`)
      .neq('id', currentUserId)
      .eq('is_searchable', true)
      .limit(10);
    
    if (error) {
      console.error('[searchUsers] Database error:', error);
      throw new Error(error.message);
    }
    
    if (!data || !Array.isArray(data)) {
      console.log("[searchUsers] No results or invalid data format:", data);
      return [];
    }
    
    const results = data.map((user) => ({
      id: user.id,
      fullName: user.full_name,
      displayName: user.display_name,
      email: user.email,
      avatarUrl: user.avatar_url,
      accountType: user.account_type,
      businessName: user.business_name
    }));
    
    console.log(`[searchUsers] Found ${results.length} results`);
    return results;
  } catch (error) {
    console.error('[searchUsers] Error in search function:', error);
    throw error;
  }
};

export const checkContactRequest = async (contactId: string): Promise<ContactRequestStatus> => {
  try {
    if (!contactId) {
      console.error("[checkContactRequest] No contactId provided");
      throw new Error('Contact ID is required');
    }
    
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      console.error("[checkContactRequest] No session found");
      throw new Error('You must be logged in to check contact status');
    }
    
    const currentUserId = session.session.user.id;
    console.log(`[checkContactRequest] Checking contact status between ${currentUserId} and ${contactId}`);
    
    // Direct query to check if a contact request exists in either direction
    const { data, error } = await supabase
      .from('user_contacts')
      .select('id, status')
      .or(`and(user_id.eq.${currentUserId},contact_id.eq.${contactId}),and(user_id.eq.${contactId},contact_id.eq.${currentUserId})`)
      .maybeSingle();
    
    if (error) {
      console.error('[checkContactRequest] Database error:', error);
      throw new Error(error.message);
    }
    
    if (!data) {
      console.log("[checkContactRequest] No existing contact request found");
      return { requestExists: false, requestStatus: 'none' };
    }
    
    // Make sure we only return valid status values
    const validStatus = (data.status === 'accepted' || data.status === 'pending' || data.status === 'rejected') 
      ? data.status as ContactRequestStatusValue
      : 'none' as ContactRequestStatusValue;
    
    console.log("[checkContactRequest] Found contact request with status:", validStatus);
    return {
      requestExists: true,
      requestStatus: validStatus
    };
  } catch (error) {
    console.error('[checkContactRequest] Error checking contact:', error);
    throw error;
  }
};
