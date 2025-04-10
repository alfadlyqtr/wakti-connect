
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the count of unread messages for the current user
 * 
 * @returns Promise with the count of unread messages
 */
export const getUnreadMessagesCount = async (): Promise<number> => {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return 0;
    }
    
    // Count unread messages where current user is the recipient
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', session.user.id)
      .eq('is_read', false);
    
    if (error) {
      console.error("Error counting unread messages:", error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Failed to fetch unread message count:", error);
    return 0;
  }
};

/**
 * Marks all messages in a conversation as read
 * 
 * @param otherUserId The ID of the other user in the conversation
 * @returns Promise indicating success or failure
 */
export const markConversationAsRead = async (otherUserId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;
    
    // Find unread messages from this user
    const { data: unreadMessages } = await supabase
      .from('messages')
      .select('id')
      .eq('sender_id', otherUserId)
      .eq('recipient_id', session.user.id)
      .eq('is_read', false);
      
    if (!unreadMessages || unreadMessages.length === 0) return true;
    
    // Mark each message as read
    for (const msg of unreadMessages) {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', msg.id);
        
      if (error) {
        console.error("Error marking message as read:", error);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    return false;
  }
};
