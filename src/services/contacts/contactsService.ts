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
        profiles:contact_id(
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
    
    // For contacts where the current user is the contact_id, we need to flip the relationship
    // to show the other person's profile
    return data.map(contact => {
      const isInverted = contact.contact_id === session.user.id;
      
      // If the relationship is inverted, we need to fetch the other user's profile separately
      if (isInverted) {
        return {
          id: contact.id,
          userId: contact.user_id,
          contactId: contact.contact_id,
          status: contact.status,
          createdAt: contact.created_at,
          updatedAt: contact.updated_at,
          staffRelationId: contact.staff_relation_id,
          // Will be filled in the second step
          contactProfile: {
            fullName: "",
            displayName: "",
            avatarUrl: ""
          }
        };
      }
      
      return {
        id: contact.id,
        userId: contact.user_id,
        contactId: contact.contact_id,
        status: contact.status,
        createdAt: contact.created_at,
        updatedAt: contact.updated_at,
        staffRelationId: contact.staff_relation_id,
        contactProfile: {
          fullName: contact.profiles?.full_name,
          displayName: contact.profiles?.display_name,
          avatarUrl: contact.profiles?.avatar_url
        }
      };
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};

/**
 * Sends a contact request to another user
 */
export const sendContactRequest = async (userId: string): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("No active session");
  }

  // Check if a contact relationship already exists
  const { data: existingContact } = await fromTable('user_contacts')
    .select('id, status')
    .or(`and(user_id.eq.${session.user.id},contact_id.eq.${userId}),and(user_id.eq.${userId},contact_id.eq.${session.user.id})`)
    .maybeSingle();

  if (existingContact) {
    if (existingContact.status === 'accepted') {
      throw new Error("This user is already in your contacts");
    } else if (existingContact.status === 'pending') {
      throw new Error("A contact request with this user is already pending");
    }
  }

  // Create new contact request - auto-approval is handled by the trigger
  const { error } = await fromTable('user_contacts')
    .insert({
      user_id: session.user.id,
      contact_id: userId,
      status: 'pending'
    });

  if (error) throw error;
  
  return true;
};

/**
 * Responds to an incoming contact request
 */
export const respondToContactRequest = async (
  requestId: string, 
  accept: boolean
): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("No active session");
  }

  const { error } = await fromTable('user_contacts')
    .update({
      status: accept ? 'accepted' : 'rejected',
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .eq('contact_id', session.user.id);

  if (error) throw error;
  
  return true;
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

/**
 * Updates auto-approve contacts setting
 */
export const updateAutoApproveContacts = async (autoApprove: boolean): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const { error } = await fromTable('profiles')
      .update({ 
        auto_approve_contacts: autoApprove,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating auto approve setting:", error);
    return false;
  }
};

/**
 * Ensures that staff and business contacts are correctly set up
 * This can be called to fix any missing relationships
 */
export const syncStaffBusinessContacts = async (): Promise<boolean> => {
  try {
    // First check if the user is a staff member
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const userId = session.user.id;
    
    // Check for a staff relation
    const { data: staffData } = await supabase
      .from('business_staff')
      .select('id, business_id, staff_id')
      .or(`staff_id.eq.${userId},business_id.eq.${userId}`)
      .eq('status', 'active');
      
    if (!staffData || staffData.length === 0) {
      return false; // Not a staff member or business with staff
    }
    
    // Create missing contacts
    const promises = staffData.map(async (relation) => {
      if (relation.staff_id === userId) {
        // This user is staff, ensure they have contact with their business
        await fromTable('user_contacts')
          .upsert({
            user_id: relation.staff_id,
            contact_id: relation.business_id,
            status: 'accepted',
            staff_relation_id: relation.id
          })
          .on_conflict('user_id, contact_id');
      } else if (relation.business_id === userId) {
        // This user is a business, ensure they have contact with their staff
        await fromTable('user_contacts')
          .upsert({
            user_id: relation.business_id,
            contact_id: relation.staff_id,
            status: 'accepted',
            staff_relation_id: relation.id
          })
          .on_conflict('user_id, contact_id');
      }
    });
    
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Error syncing staff-business contacts:", error);
    return false;
  }
};

