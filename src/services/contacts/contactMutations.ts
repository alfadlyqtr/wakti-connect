
import { supabase } from "@/lib/supabase";
import { checkContactRequest } from "./contactSearch";

/**
 * Sends a contact request to another user
 */
export const sendContactRequest = async (contactId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  
  // Check if user exists
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id, auto_approve_contacts')
    .eq('id', contactId)
    .single();
  
  if (userError || !userData) {
    throw new Error("User not found");
  }
  
  // Check if request already exists
  const contactStatus = await checkContactRequest(contactId);
  
  if (contactStatus.requestExists) {
    if (contactStatus.requestStatus === 'accepted') {
      throw new Error("Already contacts");
    } else if (contactStatus.requestStatus === 'pending') {
      throw new Error("Request already sent");
    }
  }
  
  // Determine status - auto-approved or pending
  const status = userData.auto_approve_contacts ? 'accepted' : 'pending';
  
  // Create new contact request
  const { error } = await supabase
    .from('user_contacts')
    .insert({
      user_id: session.user.id,
      contact_id: contactId,
      status
    });
  
  if (error) {
    console.error("Error sending contact request:", error);
    throw error;
  }
  
  // If auto-approved, create the reciprocal relationship
  if (userData.auto_approve_contacts) {
    const { error: reciprocalError } = await supabase
      .from('user_contacts')
      .insert({
        user_id: contactId,
        contact_id: session.user.id,
        status: 'accepted'
      });
    
    if (reciprocalError) {
      console.error("Error creating reciprocal contact:", reciprocalError);
      // Don't throw here, still consider the request successful
    }
  } else {
    // Create notification for the recipient if not auto-approved
    await supabase
      .from('notifications')
      .insert({
        user_id: contactId,
        type: 'contact_request',
        title: 'New Contact Request',
        content: 'Someone wants to add you as a contact'
      });
  }
};

/**
 * Responds to a contact request
 */
export const respondToContactRequest = async (requestId: string, accept: boolean): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  
  // Get the request details
  const { data: request, error: requestError } = await supabase
    .from('user_contacts')
    .select('*')
    .eq('id', requestId)
    .eq('contact_id', session.user.id)
    .eq('status', 'pending')
    .single();
  
  if (requestError || !request) {
    console.error("Error fetching request:", requestError);
    throw new Error("Request not found");
  }
  
  if (accept) {
    // Accept the request
    const { error } = await supabase
      .from('user_contacts')
      .update({ status: 'accepted' })
      .eq('id', requestId);
    
    if (error) {
      console.error("Error accepting request:", error);
      throw error;
    }
    
    // Create reciprocal contact record
    const { error: reciprocalError } = await supabase
      .from('user_contacts')
      .insert({
        user_id: session.user.id,
        contact_id: request.user_id,
        status: 'accepted'
      });
    
    if (reciprocalError) {
      console.error("Error creating reciprocal contact:", reciprocalError);
      throw reciprocalError;
    }
    
    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: request.user_id,
        type: 'contact_accepted',
        title: 'Contact Request Accepted',
        content: 'Your contact request was accepted'
      });
  } else {
    // Reject the request
    const { error } = await supabase
      .from('user_contacts')
      .update({ status: 'rejected' })
      .eq('id', requestId);
    
    if (error) {
      console.error("Error rejecting request:", error);
      throw error;
    }
  }
};

/**
 * Delete a contact
 */
export const deleteContact = async (contactId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  
  // Delete the relationship from user to contact
  const { error: error1 } = await supabase
    .from('user_contacts')
    .delete()
    .eq('user_id', session.user.id)
    .eq('contact_id', contactId);
  
  if (error1) {
    console.error("Error deleting contact (direction 1):", error1);
    throw error1;
  }
  
  // Delete the relationship from contact to user
  const { error: error2 } = await supabase
    .from('user_contacts')
    .delete()
    .eq('user_id', contactId)
    .eq('contact_id', session.user.id);
  
  if (error2) {
    console.error("Error deleting contact (direction 2):", error2);
    // Continue even if this fails, it could be that the reciprocal relationship doesn't exist
  }
};
