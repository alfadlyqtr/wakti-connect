
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches messages from Supabase
 * @param userId Current authenticated user ID
 * @param conversationUserId Optional ID of the conversation partner
 * @returns Raw message data from database
 */
export const fetchMessagesFromDb = async (
  userId: string,
  conversationUserId?: string
): Promise<any[]> => {
  try {
    console.log("Fetching messages for user ID:", userId);
    if (conversationUserId) {
      console.log("Filtering by conversation with user ID:", conversationUserId);
    }
    
    // First check if the message_type column exists
    const { error: columnCheckError } = await supabase
      .from('messages')
      .select('message_type')
      .limit(1);
      
    let messageData;
    let error;
    
    if (columnCheckError) {
      console.log("Using legacy message schema without message_type");
      // Use legacy schema query without relationship syntax
      const result = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          is_read,
          created_at
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at');
        
      messageData = result.data;
      error = result.error;
    } else {
      // Use new schema with message_type without relationship syntax
      const result = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          is_read,
          created_at,
          message_type,
          audio_url,
          image_url
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at');
        
      messageData = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
    
    // If no data or empty array, return empty array
    if (!messageData || messageData.length === 0) {
      console.log("No messages found");
      return [];
    }
    
    // If a specific conversation user is provided, filter for only messages between the current user and that user
    if (conversationUserId) {
      const filteredData = messageData.filter(msg => {
        const isMatch =
          (msg.sender_id === userId && msg.recipient_id === conversationUserId) ||
          (msg.sender_id === conversationUserId && msg.recipient_id === userId);

        return isMatch;
      });
      
      console.log("Total messages fetched:", messageData.length);
      console.log("Messages after filtering:", filteredData.length);
      
      return filteredData;
    }
    
    return messageData;
  } catch (error) {
    console.error("Error in fetchMessagesFromDb:", error);
    throw error;
  }
};
