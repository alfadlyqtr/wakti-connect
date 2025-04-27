
import { supabase } from "@/integrations/supabase/client";
import { ContactRequestStatusValue } from "@/types/invitation.types";

/**
 * Send a contact request to another user
 */
export const sendContactRequest = async (contactId: string): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Not authenticated");
    }
    
    const { error } = await supabase
      .from('user_contacts')
      .insert({
        user_id: session.user.id,
        contact_id: contactId,
        status: 'pending'
      });
    
    if (error) {
      console.error("Error sending contact request:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in sendContactRequest:", error);
    throw error;
  }
};

/**
 * Respond to a contact request (accept or reject)
 */
export const respondToContactRequest = async (requestId: string, accept: boolean): Promise<void> => {
  try {
    const status: ContactRequestStatusValue = accept ? 'accepted' : 'rejected';
    
    const { error } = await supabase
      .from('user_contacts')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
    
    if (error) {
      console.error("Error responding to contact request:", error);
      throw error;
    }
    
    if (accept) {
      // If accepted, create the reverse relationship as well
      const { data: requestData } = await supabase
        .from('user_contacts')
        .select('user_id, contact_id')
        .eq('id', requestId)
        .single();
      
      if (requestData) {
        const { user_id, contact_id } = requestData;
        
        // Check if the reverse relationship already exists
        const { data: existingRelation } = await supabase
          .from('user_contacts')
          .select('id')
          .eq('user_id', contact_id)
          .eq('contact_id', user_id)
          .maybeSingle();
        
        if (!existingRelation) {
          // Create the reverse relationship
          await supabase
            .from('user_contacts')
            .insert({
              user_id: contact_id,
              contact_id: user_id,
              status: 'accepted'
            });
        } else {
          // Update existing reverse relationship
          await supabase
            .from('user_contacts')
            .update({ 
              status: 'accepted',
              updated_at: new Date().toISOString()
            })
            .eq('user_id', contact_id)
            .eq('contact_id', user_id);
        }
      }
    }
  } catch (error) {
    console.error("Error in respondToContactRequest:", error);
    throw error;
  }
};

/**
 * Delete a contact relationship
 */
export const deleteContact = async (contactId: string): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Not authenticated");
    }
    
    // Delete the contact relationship
    const { error } = await supabase
      .from('user_contacts')
      .delete()
      .eq('user_id', session.user.id)
      .eq('contact_id', contactId);
    
    if (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
    
    // Also delete the reverse relationship
    await supabase
      .from('user_contacts')
      .delete()
      .eq('user_id', contactId)
      .eq('contact_id', session.user.id);
  } catch (error) {
    console.error("Error in deleteContact:", error);
    throw error;
  }
};
