
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message.types";

/**
 * Sends a message to a recipient user
 * 
 * @param recipientId The UUID of the message recipient
 * @param content The message content
 * @returns Promise with the result of the message insertion
 */
export const sendMessage = async (recipientId: string, content: string) => {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user found");
    }
    
    // Insert the message
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: session.user.id,
        recipient_id: recipientId,
        content,
        is_read: false
      })
      .select('id');
    
    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }
    
    return data;
    
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};

/**
 * Marks a message as read
 * 
 * @param messageId The UUID of the message to mark as read
 * @returns Promise with the result of the update operation
 */
export const markMessageAsRead = async (messageId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select();
    
    if (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
    
    return data;
    
  } catch (error) {
    console.error("Failed to mark message as read:", error);
    throw error;
  }
};

/**
 * Gets messages for the current user
 * 
 * @param conversationUserId Optional ID of user to get conversation with
 * @returns Promise with the messages data
 */
export const getMessages = async (conversationUserId?: string): Promise<Message[]> => {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user found");
    }
    
    let query = supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        recipient_id,
        content,
        is_read,
        created_at,
        sender:sender_id(id, full_name, display_name, business_name, avatar_url),
        recipient:recipient_id(id, full_name, display_name, business_name, avatar_url)
      `)
      .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
      .order('created_at');
    
    // If a specific conversation user is provided, filter for only messages between the current user and that user
    if (conversationUserId) {
      query = query.or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${conversationUserId}),and(sender_id.eq.${conversationUserId},recipient_id.eq.${session.user.id})`)
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
    
    // Transform the data to match the Message interface
    const messages: Message[] = data.map(msg => {
      // Get sender information
      const senderInfo = msg.sender || {};
      const senderName = senderInfo.business_name || senderInfo.display_name || senderInfo.full_name || 'Unknown User';
      
      return {
        id: msg.id,
        content: msg.content,
        senderId: msg.sender_id,
        recipientId: msg.recipient_id,
        isRead: msg.is_read,
        createdAt: msg.created_at,
        senderName: senderName,
        senderAvatar: senderInfo.avatar_url
      };
    });
    
    return messages;
    
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
};
