
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";

/**
 * Sends a message to another user
 * @param recipientId The ID of the message recipient
 * @param content Message content (limited to 20 characters)
 */
export const sendMessage = async (recipientId: string, content: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    if (content.length > 20) {
      throw new Error("Message content cannot exceed 20 characters");
    }
    
    // Check if user is allowed to send messages
    const { data: profile } = await fromTable('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
    
    if (profile?.account_type === 'free') {
      throw new Error("Free accounts cannot send messages");
    }
    
    // Get recipient profile to check if it exists
    const { data: recipientProfile } = await fromTable('profiles')
      .select('account_type')
      .eq('id', recipientId)
      .maybeSingle();
      
    if (!recipientProfile) {
      throw new Error("Recipient not found");
    }
    
    // If current user is an individual account and recipient is an individual account,
    // check if they are contacts
    if (profile?.account_type === 'individual' && recipientProfile?.account_type === 'individual') {
      const { data: contactData } = await fromTable('user_contacts')
        .select('id')
        .or(`and(user_id.eq.${session.user.id},contact_id.eq.${recipientId},status.eq.accepted),and(user_id.eq.${recipientId},contact_id.eq.${session.user.id},status.eq.accepted)`)
        .maybeSingle();
        
      if (!contactData) {
        throw new Error("You can only message individual users who are in your contacts");
      }
    }
    
    // If current user is an individual account and recipient is a business account,
    // check if user is subscribed to the business
    if (profile?.account_type === 'individual' && recipientProfile?.account_type === 'business') {
      const { data: subscriptionData } = await fromTable('business_subscribers')
        .select('id')
        .eq('subscriber_id', session.user.id)
        .eq('business_id', recipientId)
        .maybeSingle();
        
      if (!subscriptionData) {
        throw new Error("You must be subscribed to this business to send messages");
      }
    }
    
    // Insert the message
    const { error } = await fromTable('messages')
      .insert({
        sender_id: session.user.id,
        recipient_id: recipientId,
        content,
        is_read: false
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
