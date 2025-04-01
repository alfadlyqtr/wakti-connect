
import { supabase } from "@/integrations/supabase/client";

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
    .select('id')
    .eq('id', contactId)
    .single();
  
  if (userError || !userData) {
    throw new Error("User not found");
  }
  
  // Check if request already exists
  const { data: existingRequest, error: checkError } = await supabase
    .from('user_contacts')
    .select('id, status')
    .or(`user_id.eq.${session.user.id},contact_id.eq.${session.user.id}`)
    .or(`contact_id.eq.${contactId},user_id.eq.${contactId}`)
    .maybeSingle();
  
  if (checkError) {
    console.error("Error checking existing requests:", checkError);
    throw checkError;
  }
  
  if (existingRequest) {
    if (existingRequest.status === 'accepted') {
      throw new Error("Already contacts");
    } else {
      throw new Error("Request already sent");
    }
  }
  
  // Create new contact request
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
  
  // Create notification for the recipient
  await supabase
    .from('notifications')
    .insert({
      user_id: contactId,
      type: 'contact_request',
      title: 'New Contact Request',
      content: 'Someone wants to add you as a contact'
    });
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
      .delete()
      .eq('id', requestId);
    
    if (error) {
      console.error("Error rejecting request:", error);
      throw error;
    }
  }
};
