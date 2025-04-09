
import { supabase } from "@/integrations/supabase/client";

/**
 * Sends a message to another user
 * @param recipientId The ID of the message recipient
 * @param content Message content
 */
export const sendMessage = async (recipientId: string, content: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // Check if user is allowed to send messages
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
    
    if (profileError || !profileData) {
      throw new Error("User profile not found");
    }
    
    const profile = profileData as { account_type: string };
    
    if (profile.account_type === 'free') {
      throw new Error("Free accounts cannot send messages");
    }
    
    // Get recipient profile to check if it exists
    const { data: recipientProfileData, error: recipientProfileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', recipientId)
      .maybeSingle();
      
    if (recipientProfileError || !recipientProfileData) {
      // Check if this is a staff member that might not have a profiles entry
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('id')
        .eq('staff_id', recipientId)
        .maybeSingle();
        
      if (!staffData) {
        throw new Error("Recipient not found");
      }
    }
    
    // Insert the message
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: session.user.id,
        recipient_id: recipientId,
        content,
        is_read: false
      });
    
    if (error) throw error;
    
    console.log("Message sent successfully");
    
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
