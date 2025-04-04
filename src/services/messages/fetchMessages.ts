
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message.types";

/**
 * Fetches messages between the current user and another user
 * @param otherUserId The ID of the other user in the conversation
 */
export const fetchMessages = async (otherUserId: string): Promise<Message[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const currentUserId = session.user.id;
    
    // Get messages between the two users
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        sender_id,
        recipient_id,
        is_read,
        created_at,
        profiles:sender_id(display_name, avatar_url)
      `)
      .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Update all unread messages sent by the other user as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', otherUserId)
      .eq('recipient_id', currentUserId)
      .eq('is_read', false);
    
    // Map the data safely with fallbacks for potentially undefined fields
    return (data || []).map(msg => ({
      id: msg.id || '',
      content: msg.content || '',
      senderId: msg.sender_id || '',
      recipientId: msg.recipient_id || '',
      isRead: msg.is_read || false,
      createdAt: msg.created_at || '',
      senderName: msg.profiles !== null && typeof msg.profiles === 'object' ? msg.profiles.display_name || '' : '',
      senderAvatar: msg.profiles !== null && typeof msg.profiles === 'object' ? msg.profiles.avatar_url || '' : ''
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};
