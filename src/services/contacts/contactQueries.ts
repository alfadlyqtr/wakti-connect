
import { supabase } from "@/integrations/supabase/client";
import { UserContact } from "@/types/invitation.types";
import { fromTable } from "@/integrations/supabase/helper";

/**
 * Fetches all accepted contacts for the current user
 */
export const fetchContacts = async (): Promise<UserContact[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // Get all contacts where the user is either the requester or recipient
    const { data, error } = await fromTable('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        created_at,
        updated_at,
        staff_relation_id
      `)
      .or(`user_id.eq.${session.user.id},contact_id.eq.${session.user.id}`)
      .eq('status', 'accepted');
    
    if (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
    
    // Create a Set to track unique contactIds to avoid duplicates
    const uniqueContactIds = new Set();
    const uniqueContacts = [];
    
    for (const contact of data) {
      const contactId = contact.user_id === session.user.id ? contact.contact_id : contact.user_id;
      
      // Skip if we've already processed this contact
      if (uniqueContactIds.has(contactId)) continue;
      
      uniqueContactIds.add(contactId);
      uniqueContacts.push(contact);
    }
    
    console.log("Filtered unique contacts:", uniqueContacts.length);
    
    // Fetch all profile data in a single query for better performance
    const contactIds = Array.from(uniqueContactIds);
    
    if (contactIds.length === 0) {
      return [];
    }
    
    const { data: profilesData, error: profilesError } = await fromTable('profiles')
      .select('id, full_name, display_name, avatar_url, email, account_type')
      .in('id', contactIds);
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }
    
    // Create a map of profiles for easy lookup
    const profilesMap = {};
    profilesData.forEach(profile => {
      profilesMap[profile.id] = profile;
    });
    
    // Map the contact data with the profiles
    return uniqueContacts.map(contact => {
      const isInverted = contact.contact_id === session.user.id;
      const profileId = isInverted ? contact.user_id : contact.contact_id;
      const profile = profilesMap[profileId];
      
      return {
        id: contact.id,
        userId: contact.user_id,
        contactId: contact.contact_id,
        status: contact.status,
        createdAt: contact.created_at,
        updatedAt: contact.updated_at,
        staffRelationId: contact.staff_relation_id,
        contactProfile: profile ? {
          fullName: profile.full_name,
          displayName: profile.display_name,
          avatarUrl: profile.avatar_url,
          email: profile.email,
          accountType: profile.account_type
        } : {
          fullName: "",
          displayName: "",
          avatarUrl: "",
          email: "",
          accountType: "free"
        }
      };
    });
  } catch (error) {
    console.error("Error in fetchContacts:", error);
    return [];
  }
};

/**
 * Fetches pending contact requests for the current user
 */
export const fetchPendingRequests = async (): Promise<UserContact[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const { data, error } = await fromTable('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        created_at,
        updated_at,
        staff_relation_id,
        profiles:user_id(
          full_name,
          display_name,
          avatar_url,
          email,
          account_type
        )
      `)
      .eq('contact_id', session.user.id)
      .eq('status', 'pending');
    
    if (error) throw error;
    
    return data.map(request => ({
      id: request.id,
      userId: request.user_id,
      contactId: request.contact_id,
      status: request.status,
      createdAt: request.created_at,
      updatedAt: request.updated_at,
      staffRelationId: request.staff_relation_id,
      contactProfile: {
        fullName: request.profiles?.full_name,
        displayName: request.profiles?.display_name,
        avatarUrl: request.profiles?.avatar_url,
        email: request.profiles?.email,
        accountType: request.profiles?.account_type
      }
    }));
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    return [];
  }
};
