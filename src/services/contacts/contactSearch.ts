import { supabase } from "@/integrations/supabase/client";
import { UserSearchResult, ContactRequestStatus, ContactRequestStatusValue } from "@/types/invitation.types";

/**
 * Search for users by email, name or business name
 */
export const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
  try {
    if (!query || query.length < 3) {
      return [];
    }
    
    const { data, error } = await supabase.rpc('search_users', {
      search_query: query
    });
    
    if (error) {
      console.error("Error searching users:", error);
      return [];
    }
    
    // Transform the response to match our type
    return data.map((user: any) => ({
      id: user.id,
      fullName: user.full_name,
      displayName: user.display_name,
      email: user.email,
      avatarUrl: user.avatar_url,
      accountType: user.account_type,
      businessName: user.business_name
    }));
  } catch (error) {
    console.error("Error in searchUsers:", error);
    return [];
  }
};

/**
 * Check if a contact request already exists
 */
export const checkContactRequest = async (contactId: string): Promise<ContactRequestStatus> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Not authenticated");
    }
    
    // Use RPC function to check contact request status
    const { data, error } = await supabase.rpc('check_contact_request', {
      user_id_param: session.user.id,
      contact_id_param: contactId
    });
    
    if (error) {
      console.error("Error checking contact request:", error);
      return { requestExists: false, requestStatus: null };
    }
    
    // The RPC function returns a single row with request_exists and request_status
    if (data && data.length > 0) {
      const status = data[0].request_status;
      return {
        requestExists: data[0].request_exists,
        requestStatus: status === 'none' ? null : status as ContactRequestStatusValue
      };
    }
    
    return { requestExists: false, requestStatus: null };
  } catch (error) {
    console.error("Error in checkContactRequest:", error);
    return { requestExists: false, requestStatus: null };
  }
};

/**
 * Get profile data for a user, even if they are a pending contact
 */
export const fetchContactProfile = async (userId: string): Promise<UserSearchResult | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        display_name,
        avatar_url, 
        account_type,
        business_name,
        email
      `)
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      return null;
    }
    
    return {
      id: data.id,
      fullName: data.full_name,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      accountType: data.account_type,
      businessName: data.business_name,
      email: data.email
    };
  } catch (error) {
    console.error(`Error in fetchContactProfile for user ${userId}:`, error);
    return null;
  }
};
