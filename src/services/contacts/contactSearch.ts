
import { supabase } from "@/integrations/supabase/client";
import { UserSearchResult, ContactRequestStatus } from "@/types/invitation.types";

/**
 * Search for users by name, email, or business name
 */
export const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  try {
    // Use a simpler query approach to avoid nested join issues
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, display_name, avatar_url, account_type, business_name')
      .or(`full_name.ilike.%${query}%,display_name.ilike.%${query}%,business_name.ilike.%${query}%`)
      .eq('is_searchable', true)
      .limit(10);
    
    if (error) {
      console.error("Error searching users:", error);
      throw error;
    }
    
    if (!data || !Array.isArray(data)) {
      console.warn("Unexpected response format from search:", data);
      return [];
    }
    
    // Transform the results to match our interface
    return data.map((user) => ({
      id: user.id,
      fullName: user.full_name,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      accountType: user.account_type,
      businessName: user.business_name,
      email: undefined // We don't get email in this query for privacy reasons
    }));
  } catch (error) {
    console.error("Exception during user search:", error);
    return [];
  }
};

/**
 * Check if a contact request already exists between users
 */
export const checkContactRequest = async (contactId: string): Promise<ContactRequestStatus> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  
  try {
    // Check if contact request exists by querying the table directly
    const { data, error } = await supabase
      .from('user_contacts')
      .select('status')
      .or(`and(user_id.eq.${session.user.id},contact_id.eq.${contactId}),and(user_id.eq.${contactId},contact_id.eq.${session.user.id})`)
      .limit(1);
    
    if (error) {
      console.error("Error checking contact request:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return { requestExists: false, requestStatus: 'none' };
    }
    
    return {
      requestExists: true,
      requestStatus: data[0].status
    };
  } catch (error) {
    console.error("Exception checking contact request:", error);
    return { requestExists: false, requestStatus: 'none' };
  }
};
