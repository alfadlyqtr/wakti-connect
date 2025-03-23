
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
    
    // Get contacts where the user is either the requester or recipient
    const { data, error } = await fromTable('user_contacts')
      .select(`
        id, 
        user_id,
        contact_id,
        status,
        created_at,
        updated_at,
        staff_relation_id,
        contact_profiles:profiles!contact_id(
          full_name,
          display_name,
          avatar_url
        )
      `)
      .or(`user_id.eq.${session.user.id},contact_id.eq.${session.user.id}`)
      .eq('status', 'accepted');
    
    if (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
    
    console.log("Fetched contacts data:", data);
    
    // For contacts where the current user is the contact_id, we need to flip the relationship
    // to show the other person's profile
    return data.map(contact => {
      const isInverted = contact.contact_id === session.user.id;
      
      if (isInverted) {
        // For inverted relationships, we need to fetch the user's profile
        return {
          id: contact.id,
          userId: contact.user_id,
          contactId: contact.contact_id,
          status: contact.status,
          createdAt: contact.created_at,
          updatedAt: contact.updated_at,
          staffRelationId: contact.staff_relation_id,
          // Will fetch the profile separately in the component
          contactProfile: {
            fullName: "",
            displayName: "",
            avatarUrl: ""
          }
        };
      }
      
      // For regular relationship, use the joined profile data
      return {
        id: contact.id,
        userId: contact.user_id,
        contactId: contact.contact_id,
        status: contact.status,
        createdAt: contact.created_at,
        updatedAt: contact.updated_at,
        staffRelationId: contact.staff_relation_id,
        contactProfile: {
          fullName: contact.contact_profiles?.full_name,
          displayName: contact.contact_profiles?.display_name,
          avatarUrl: contact.contact_profiles?.avatar_url
        }
      };
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
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
          avatar_url
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
        avatarUrl: request.profiles?.avatar_url
      }
    }));
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    return [];
  }
};
