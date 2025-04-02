
import { supabase } from "@/integrations/supabase/client";
import { UserSearchResult, ContactRequestStatus } from "@/types/invitation.types";

/**
 * Search for users by name, email, or business name
 */
export const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const { data, error } = await supabase
    .rpc('search_users', { search_query: query.trim() });
  
  if (error) {
    console.error("Error searching users:", error);
    throw error;
  }
  
  // Transform the results to match our interface
  return data.map((user) => ({
    id: user.id,
    fullName: user.full_name,
    displayName: user.display_name,
    email: user.email,
    avatarUrl: user.avatar_url,
    accountType: user.account_type,
    businessName: user.business_name
  }));
};

/**
 * Check if a contact request already exists between users
 */
export const checkContactRequest = async (contactId: string): Promise<ContactRequestStatus> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  
  const { data, error } = await supabase
    .rpc('check_contact_request', { 
      user_id_param: session.user.id, 
      contact_id_param: contactId 
    });
  
  if (error) {
    console.error("Error checking contact request:", error);
    throw error;
  }
  
  return {
    requestExists: data[0].request_exists,
    requestStatus: data[0].request_status
  };
};
