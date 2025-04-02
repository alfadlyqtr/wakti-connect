
import { supabase } from "@/integrations/supabase/client";
import { UserContact } from "@/types/invitation.types";

/**
 * Fetches the user's accepted contacts
 */
export const fetchContacts = async (): Promise<UserContact[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  
  console.log("Fetching contacts for user:", session.user.id);
  
  const { data, error } = await supabase
    .from('user_contacts')
    .select(`
      id,
      user_id,
      contact_id,
      status,
      staff_relation_id,
      contactProfile:contact_id(
        id, 
        full_name, 
        display_name, 
        avatar_url,
        account_type
      )
    `)
    .eq('user_id', session.user.id)
    .eq('status', 'accepted');
  
  if (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
  
  // Transform the data to match our interface
  return data.map(contact => ({
    id: contact.id,
    userId: contact.user_id,
    contactId: contact.contact_id,
    status: contact.status as 'pending' | 'accepted' | 'rejected',
    staffRelationId: contact.staff_relation_id,
    contactProfile: contact.contactProfile ? {
      id: contact.contactProfile.id,
      fullName: contact.contactProfile.full_name,
      displayName: contact.contactProfile.display_name,
      avatarUrl: contact.contactProfile.avatar_url,
      accountType: contact.contactProfile.account_type
    } : undefined
  }));
};

/**
 * Fetches pending contact requests for the user
 */
export const fetchPendingRequests = async (): Promise<UserContact[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  
  const { data, error } = await supabase
    .from('user_contacts')
    .select(`
      id,
      user_id,
      contact_id,
      status,
      contactProfile:contact_id(
        id, 
        full_name, 
        display_name, 
        avatar_url,
        account_type
      )
    `)
    .eq('contact_id', session.user.id)
    .eq('status', 'pending');
  
  if (error) {
    console.error("Error fetching pending requests:", error);
    throw error;
  }
  
  // Transform the data to match our interface
  return data.map(contact => ({
    id: contact.id,
    userId: contact.user_id,
    contactId: contact.contact_id,
    status: contact.status as 'pending' | 'accepted' | 'rejected',
    contactProfile: contact.contactProfile ? {
      id: contact.contactProfile.id,
      fullName: contact.contactProfile.full_name,
      displayName: contact.contactProfile.display_name,
      avatarUrl: contact.contactProfile.avatar_url,
      accountType: contact.contactProfile.account_type
    } : undefined
  }));
};
