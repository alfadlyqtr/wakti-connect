
import { supabase } from "@/integrations/supabase/client";

/**
 * Sends a message to a recipient user
 * 
 * @param recipientId The UUID of the message recipient
 * @param content The message content
 * @param type Message type (text, voice, image)
 * @param audioUrl URL to audio file (for voice messages)
 * @param imageUrl URL to image file (for image messages)
 * @returns Promise with the result of the message insertion
 */
export const sendMessage = async (
  recipientId: string, 
  content: string, 
  type: 'text' | 'voice' | 'image' = 'text',
  audioUrl?: string,
  imageUrl?: string
) => {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user found");
    }
    
    console.log(`Sending ${type} message to:`, recipientId, "Content:", content);
    
    // Check if the messages table has the new columns
    try {
      // First check if the new columns exist
      const { error: columnCheckError } = await supabase
        .from('messages')
        .select('message_type')
        .limit(1);
        
      if (columnCheckError) {
        console.log("Message table doesn't have new columns yet, using legacy insert");
        // If the column doesn't exist, use the legacy insert
        const { data, error } = await supabase
          .from('messages')
          .insert({
            sender_id: session.user.id,
            recipient_id: recipientId,
            content,
            is_read: false
          })
          .select('id');
          
        if (error) throw error;
        return data;
      }
      
      // New columns exist, use the updated schema
      const insertData = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        content,
        is_read: false,
        message_type: type,
        audio_url: audioUrl,
        image_url: imageUrl
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(insertData)
        .select('id');
      
      if (error) throw error;
      
      console.log("Message sent successfully:", data);
      return data;
    } catch (error) {
      console.error("Error checking column existence:", error);
      throw error;
    }
    
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};
