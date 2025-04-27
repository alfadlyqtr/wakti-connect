
import { supabase } from "@/integrations/supabase/client";
import { UserContact, ContactsRequestsResponse } from "@/types/invitation.types";

/**
 * Get a user's contacts
 */
export const getUserContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    // Get contacts where user is the owner of the contact
    const { data: contactsData, error } = await supabase
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
      console.error("Error fetching contacts:", error);
      return [];
    }
    
    // Early return if no contacts
    if (!contactsData || contactsData.length === 0) {
      return [];
    }

    // Get contact profile details
    const contactIds = contactsData.map(contact => contact.contact_id);
    const { data: profiles, error: profilesError } = await supabase
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
      .in('id', contactIds);
      
    if (profilesError) {
      console.error("Error fetching contact profiles:", profilesError);
    }
    
    // Create a map for faster profile lookup
    const profileMap: Record<string, any> = {};
    if (profiles) {
      profiles.forEach(profile => {
        profileMap[profile.id] = profile;
      });
    }
    
    // Format the contacts with profile information
    const formattedContacts: UserContact[] = contactsData.map(contact => {
      const profile = profileMap[contact.contact_id] || {};
      
      return {
        id: contact.id,
        user_id: contact.user_id,
        contact_id: contact.contact_id,
        status: contact.status as 'pending' | 'accepted' | 'rejected',
        staff_relation_id: contact.staff_relation_id,
        created_at: contact.created_at,
        contactProfile: {
          id: contact.contact_id,
          fullName: profile.full_name || 'Unknown',
          displayName: profile.display_name || profile.full_name || 'Unknown',
          avatarUrl: profile.avatar_url || '',
          accountType: profile.account_type || 'free',
          businessName: profile.business_name || '',
          email: profile.email || ''
        }
      };
    });
    
    return formattedContacts;
  } catch (error) {
    console.error("Error in getUserContacts:", error);
    return [];
  }
};

/**
 * Get a user's incoming and outgoing contact requests
 */
export const getContactRequests = async (userId: string): Promise<ContactsRequestsResponse> => {
  try {
    // Get incoming requests (where user is the contact)
    const { data: incomingData, error: incomingError } = await supabase
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
      console.error("Error fetching incoming requests:", incomingError);
      return { incoming: [], outgoing: [] };
    }

    // Get outgoing requests (where user is the requester)
    const { data: outgoingData, error: outgoingError } = await supabase
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
      console.error("Error fetching outgoing requests:", outgoingError);
      return { incoming: incomingData ? await formatIncomingRequests(incomingData) : [], outgoing: [] };
    }
    
    const incoming = incomingData ? await formatIncomingRequests(incomingData) : [];
    const outgoing = outgoingData ? await formatOutgoingRequests(outgoingData) : [];
    
    return {
      incoming,
      outgoing
    };
  } catch (error) {
    console.error("Error in getContactRequests:", error);
    return {
      incoming: [],
      outgoing: []
    };
  }
};

// Helper function to format incoming requests with requester profile information
async function formatIncomingRequests(requests: any[]): Promise<UserContact[]> {
  try {
    if (requests.length === 0) return [];
    
    // Get profile information for requesters
    const requesterIds = requests.map(req => req.user_id);
    const { data: profiles, error } = await supabase
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
      .in('id', requesterIds);
      
    if (error) {
      console.error("Error fetching requester profiles:", error);
    }
    
    // Create a map for faster profile lookup
    const profileMap: Record<string, any> = {};
    if (profiles) {
      profiles.forEach(profile => {
        profileMap[profile.id] = profile;
      });
    }
    
    // Format the requests with profile information
    const formattedRequests: UserContact[] = requests.map(request => {
      const profile = profileMap[request.user_id] || {};
      
      return {
        id: request.id,
        user_id: request.user_id,
        contact_id: request.contact_id,
        status: request.status as 'pending' | 'accepted' | 'rejected',
        staff_relation_id: request.staff_relation_id,
        created_at: request.created_at,
        contactProfile: {
          id: request.user_id,
          fullName: profile.full_name || 'Unknown',
          displayName: profile.display_name || profile.full_name || 'Unknown',
          avatarUrl: profile.avatar_url || '',
          accountType: profile.account_type || 'free',
          businessName: profile.business_name || '',
          email: profile.email || ''
        }
      };
    });
    
    return formattedRequests;
  } catch (error) {
    console.error("Error in formatIncomingRequests:", error);
    return [];
  }
}

// Helper function to format outgoing requests with recipient profile information
async function formatOutgoingRequests(requests: any[]): Promise<UserContact[]> {
  try {
    if (requests.length === 0) return [];
    
    // Get profile information for recipients
    const recipientIds = requests.map(req => req.contact_id);
    const { data: profiles, error } = await supabase
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
      .in('id', recipientIds);
      
    if (error) {
      console.error("Error fetching recipient profiles:", error);
    }
    
    // Create a map for faster profile lookup
    const profileMap: Record<string, any> = {};
    if (profiles) {
      profiles.forEach(profile => {
        profileMap[profile.id] = profile;
      });
    }
    
    // Format the requests with profile information
    const formattedRequests: UserContact[] = requests.map(request => {
      const profile = profileMap[request.contact_id] || {};
      
      return {
        id: request.id,
        user_id: request.user_id,
        contact_id: request.contact_id,
        status: request.status as 'pending' | 'accepted' | 'rejected',
        staff_relation_id: request.staff_relation_id,
        created_at: request.created_at,
        contactProfile: {
          id: request.contact_id,
          fullName: profile.full_name || 'Unknown',
          displayName: profile.display_name || profile.full_name || 'Unknown',
          avatarUrl: profile.avatar_url || '',
          accountType: profile.account_type || 'free',
          businessName: profile.business_name || '',
          email: profile.email || ''
        }
      };
    });
    
    return formattedRequests;
  } catch (error) {
    console.error("Error in formatOutgoingRequests:", error);
    return [];
  }
}

/**
 * Get staff contacts for a user
 */
export const getStaffContacts = async (userId: string): Promise<UserContact[]> => {
  try {
    // Get staff contacts (marked by staff_relation_id)
    const { data: staffContactsData, error } = await supabase
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
      console.error("Error fetching staff contacts:", error);
      return [];
    }
    
    if (!staffContactsData || staffContactsData.length === 0) {
      return [];
    }
    
    // Get contact profile details
    const contactIds = staffContactsData.map(contact => contact.contact_id);
    const { data: profiles, error: profilesError } = await supabase
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
      .in('id', contactIds);
      
    if (profilesError) {
      console.error("Error fetching staff profiles:", profilesError);
    }
    
    // Create a map for faster profile lookup
    const profileMap: Record<string, any> = {};
    if (profiles) {
      profiles.forEach(profile => {
        profileMap[profile.id] = profile;
      });
    }
    
    // Format the contacts with profile information
    const formattedStaffContacts: UserContact[] = staffContactsData.map(contact => {
      const profile = profileMap[contact.contact_id] || {};
      
      return {
        id: contact.id,
        user_id: contact.user_id,
        contact_id: contact.contact_id,
        status: contact.status as 'pending' | 'accepted' | 'rejected',
        staff_relation_id: contact.staff_relation_id,
        created_at: contact.created_at,
        contactProfile: {
          id: contact.contact_id,
          fullName: profile.full_name || 'Unknown',
          displayName: profile.display_name || profile.full_name || 'Unknown',
          avatarUrl: profile.avatar_url || '',
          accountType: profile.account_type || 'free',
          businessName: profile.business_name || '',
          email: profile.email || ''
        }
      };
    });
    
    return formattedStaffContacts;
  } catch (error) {
    console.error("Error in getStaffContacts:", error);
    return [];
  }
};
