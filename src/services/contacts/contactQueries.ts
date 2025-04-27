
import { supabase } from "@/integrations/supabase/client";
import { UserContact, UserSearchResult, ContactRequestStatusValue } from "@/types/invitation.types";
import { fetchContactProfile } from "./contactSearch";

/**
 * Get the user's approved contacts
 */
export const getUserContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    const { data, error } = await supabase
      .from('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }

    // For each contact, fetch their profile data
    const contactsWithProfiles = await Promise.all(
      data.map(async (contact) => {
        try {
          // We need to fetch the profiles separately to avoid errors with the join
          const { data: profileData } = await supabase
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
            .eq('id', contact.contact_id)
            .single();
            
          return {
            ...contact,
            contactProfile: profileData ? {
              id: profileData.id,
              fullName: profileData.full_name,
              displayName: profileData.display_name,
              avatarUrl: profileData.avatar_url,
              accountType: profileData.account_type,
              businessName: profileData.business_name,
              email: profileData.email
            } : null
          };
        } catch (profileError) {
          console.error('Error fetching contact profile:', profileError);
          return {
            ...contact,
            contactProfile: null
          };
        }
      })
    );

    return contactsWithProfiles as UserContact[];
  } catch (error) {
    console.error('Error in getUserContacts:', error);
    return [];
  }
};

/**
 * Get the user's pending contact requests (both incoming and outgoing)
 */
export const getContactRequests = async (userId: string): Promise<{ incoming: UserContact[]; outgoing: UserContact[] }> => {
  try {
    // Get incoming requests
    const { data: incomingRequestsData, error: incomingError } = await supabase
      .from('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at
      `)
      .eq('contact_id', userId)
      .eq('status', 'pending');

    if (incomingError) {
      console.error('Error fetching incoming requests:', incomingError);
      return { incoming: [], outgoing: [] };
    }

    // For each incoming request, fetch the sender's profile data
    const incomingWithProfiles = await Promise.all(
      (incomingRequestsData || []).map(async (request) => {
        try {
          // We need to fetch the profiles separately to avoid errors with the join
          const { data: profileData } = await supabase
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
            .eq('id', request.user_id)
            .single();
            
          return {
            ...request,
            contactProfile: profileData ? {
              id: profileData.id,
              fullName: profileData.full_name,
              displayName: profileData.display_name,
              avatarUrl: profileData.avatar_url,
              accountType: profileData.account_type,
              businessName: profileData.business_name,
              email: profileData.email
            } : null
          };
        } catch (profileError) {
          console.error('Error fetching incoming request profile:', profileError);
          return {
            ...request,
            contactProfile: null
          };
        }
      })
    );

    // Get outgoing requests
    const { data: outgoingRequestsData, error: outgoingError } = await supabase
      .from('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at
      `)
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (outgoingError) {
      console.error('Error fetching outgoing requests:', outgoingError);
      return { incoming: incomingWithProfiles as UserContact[], outgoing: [] };
    }

    // For each outgoing request, fetch the recipient's profile data
    const outgoingWithProfiles = await Promise.all(
      (outgoingRequestsData || []).map(async (request) => {
        try {
          // We need to fetch the profiles separately to avoid errors with the join
          const { data: profileData } = await supabase
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
            .eq('id', request.contact_id)
            .single();
            
          return {
            ...request,
            contactProfile: profileData ? {
              id: profileData.id,
              fullName: profileData.full_name,
              displayName: profileData.display_name,
              avatarUrl: profileData.avatar_url,
              accountType: profileData.account_type,
              businessName: profileData.business_name,
              email: profileData.email
            } : null
          };
        } catch (profileError) {
          console.error('Error fetching outgoing request profile:', profileError);
          return {
            ...request,
            contactProfile: null
          };
        }
      })
    );

    return {
      incoming: incomingWithProfiles as UserContact[],
      outgoing: outgoingWithProfiles as UserContact[]
    };
  } catch (error) {
    console.error('Error in getContactRequests:', error);
    return { incoming: [], outgoing: [] };
  }
};

/**
 * Get staff contacts for the current user
 */
export const getStaffContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    const { data, error } = await supabase
      .from('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted')
      .not('staff_relation_id', 'is', null);

    if (error) {
      console.error('Error fetching staff contacts:', error);
      return [];
    }

    // For each contact, fetch their profile data
    const contactsWithProfiles = await Promise.all(
      data.map(async (contact) => {
        try {
          // We need to fetch the profiles separately to avoid errors with the join
          const { data: profileData } = await supabase
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
            .eq('id', contact.contact_id)
            .single();
            
          return {
            ...contact,
            contactProfile: profileData ? {
              id: profileData.id,
              fullName: profileData.full_name,
              displayName: profileData.display_name,
              avatarUrl: profileData.avatar_url,
              accountType: profileData.account_type,
              businessName: profileData.business_name,
              email: profileData.email
            } : null
          };
        } catch (profileError) {
          console.error('Error fetching staff contact profile:', profileError);
          return {
            ...contact,
            contactProfile: null
          };
        }
      })
    );

    return contactsWithProfiles as UserContact[];
  } catch (error) {
    console.error('Error in getStaffContacts:', error);
    return [];
  }
};

/**
 * Search for users by name or email
 */
export const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
  try {
    if (!query || query.length < 2) {
      return [];
    }
    
    const { data, error } = await supabase.rpc('search_users', {
      search_query: query
    });
    
    if (error) {
      console.error("Error searching users:", error);
      return [];
    }
    
    // Transform the response to match our expected type
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
