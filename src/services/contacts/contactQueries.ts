
import { supabase } from "@/integrations/supabase/client";
import { UserContact, ContactRequestStatus } from "@/types/invitation.types";

/**
 * Get all contacts for a user
 */
export const getUserContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    // Fetch contacts where the current user is the owner of the contact
    const { data: contactsData, error } = await supabase
      .from('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at,
        profiles!user_contacts_contact_id_fkey(
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
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching user contacts:", error);
      throw error;
    }
    
    // Map and transform data to match UserContact interface
    const contacts: UserContact[] = contactsData.map(contact => {
      const profileData = contact.profiles || {};
      return {
        id: contact.id,
        userId: contact.user_id,
        contactId: contact.contact_id,
        status: contact.status as ContactRequestStatus,
        staffRelationId: contact.staff_relation_id,
        fullName: profileData.full_name || 'Unknown',
        displayName: profileData.display_name || profileData.full_name || 'Unknown',
        avatarUrl: profileData.avatar_url || null,
        accountType: profileData.account_type || 'free',
        businessName: profileData.business_name || null,
        email: profileData.email || '',
        createdAt: contact.created_at
      };
    });
    
    return contacts;
  } catch (error) {
    console.error("Error in getUserContacts:", error);
    return [];
  }
};

/**
 * Get pending contact requests (both incoming and outgoing)
 */
export const getContactRequests = async (userId: string): Promise<{
  incoming: UserContact[];
  outgoing: UserContact[];
}> => {
  try {
    // Fetch incoming requests (where others have sent requests to current user)
    const { data: incomingData, error: incomingError } = await supabase
      .from('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at,
        profiles!user_contacts_user_id_fkey(
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
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (incomingError) {
      console.error("Error fetching incoming requests:", incomingError);
      throw incomingError;
    }
    
    // Fetch outgoing requests (where current user has sent requests to others)
    const { data: outgoingData, error: outgoingError } = await supabase
      .from('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at,
        profiles!user_contacts_contact_id_fkey(
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
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (outgoingError) {
      console.error("Error fetching outgoing requests:", outgoingError);
      throw outgoingError;
    }
    
    // Transform incoming requests
    const incomingRequests: UserContact[] = incomingData.map(request => {
      const profileData = request.profiles || {};
      return {
        id: request.id,
        userId: request.user_id,
        contactId: request.contact_id,
        status: request.status as ContactRequestStatus,
        staffRelationId: request.staff_relation_id,
        fullName: profileData.full_name || 'Unknown',
        displayName: profileData.display_name || profileData.full_name || 'Unknown',
        avatarUrl: profileData.avatar_url || null,
        accountType: profileData.account_type || 'free',
        businessName: profileData.business_name || null,
        email: profileData.email || '',
        createdAt: request.created_at
      };
    });
    
    // Transform outgoing requests
    const outgoingRequests: UserContact[] = outgoingData.map(request => {
      const profileData = request.profiles || {};
      return {
        id: request.id,
        userId: request.user_id,
        contactId: request.contact_id,
        status: request.status as ContactRequestStatus,
        staffRelationId: request.staff_relation_id,
        fullName: profileData.full_name || 'Unknown',
        displayName: profileData.display_name || profileData.full_name || 'Unknown',
        avatarUrl: profileData.avatar_url || null,
        accountType: profileData.account_type || 'free',
        businessName: profileData.business_name || null,
        email: profileData.email || '',
        createdAt: request.created_at
      };
    });
    
    return {
      incoming: incomingRequests,
      outgoing: outgoingRequests
    };
  } catch (error) {
    console.error("Error in getContactRequests:", error);
    return {
      incoming: [],
      outgoing: []
    };
  }
};

/**
 * Get staff contacts for the current user
 */
export const getStaffContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    // Get staff contacts (users connected via staff_relation_id)
    const { data: staffContacts, error } = await supabase
      .from('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        staff_relation_id,
        created_at,
        profiles!user_contacts_contact_id_fkey(
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
      .not('staff_relation_id', 'is', null)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching staff contacts:", error);
      throw error;
    }
    
    // Transform staff contacts to match UserContact interface
    const contacts: UserContact[] = staffContacts.map(contact => {
      const profileData = contact.profiles || {};
      return {
        id: contact.id,
        userId: contact.user_id,
        contactId: contact.contact_id,
        status: contact.status as ContactRequestStatus,
        staffRelationId: contact.staff_relation_id,
        fullName: profileData.full_name || 'Unknown',
        displayName: profileData.display_name || profileData.full_name || 'Unknown',
        avatarUrl: profileData.avatar_url || null,
        accountType: profileData.account_type || 'free',
        businessName: profileData.business_name || null,
        email: profileData.email || '',
        createdAt: contact.created_at
      };
    });
    
    return contacts;
  } catch (error) {
    console.error("Error in getStaffContacts:", error);
    return [];
  }
};

/**
 * Search for users to add as contacts
 */
export const searchUsers = async (query: string): Promise<UserContact[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const { data, error } = await supabase.rpc('search_users', {
      search_query: query
    });
    
    if (error) {
      console.error("Error searching users:", error);
      throw error;
    }
    
    // Transform search results to match UserContact interface
    return (data || []).map(user => ({
      id: '', // This will be populated if a contact request is created
      userId: '',
      contactId: user.id,
      status: 'none' as ContactRequestStatus,
      staffRelationId: null,
      fullName: user.full_name || 'Unknown',
      displayName: user.display_name || user.full_name || 'Unknown',
      avatarUrl: user.avatar_url || null,
      accountType: user.account_type || 'free',
      businessName: user.business_name || null,
      email: user.email || '',
      createdAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error in searchUsers:", error);
    return [];
  }
};

/**
 * Check if a contact request already exists between two users
 */
export const checkContactRequest = async (contactId: string): Promise<{ 
  requestExists: boolean;
  requestStatus: string;
}> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("Not authenticated");
    }
    
    const { data, error } = await supabase.rpc('check_contact_request', {
      user_id_param: session.user.id,
      contact_id_param: contactId
    });
    
    if (error) {
      console.error("Error checking contact request:", error);
      return { requestExists: false, requestStatus: 'none' };
    }
    
    return {
      requestExists: data?.[0]?.request_exists || false,
      requestStatus: data?.[0]?.request_status || 'none'
    };
  } catch (error) {
    console.error("Error in checkContactRequest:", error);
    return { requestExists: false, requestStatus: 'none' };
  }
};
