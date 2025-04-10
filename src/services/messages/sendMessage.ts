
import { supabase } from "@/integrations/supabase/client";

/**
 * Sends a message to a recipient user
 * 
 * @param recipientId The UUID of the message recipient
 * @param content The message content (required for text messages, null for others)
 * @param type Message type (text, voice, image)
 * @param audioUrl URL to audio file (required for voice messages)
 * @param imageUrl URL to image file (required for image messages)
 * @returns Promise with the result of the message insertion
 */
export const sendMessage = async (
  recipientId: string, 
  content: string | null = null, 
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
    
    // Validate message data based on type
    if (type === 'text') {
      if (!content || content.trim().length === 0) {
        throw new Error("Text message requires content");
      }
      if (content.length > 300) {
        throw new Error("Text message cannot exceed 300 characters");
      }
      // For text messages, make sure audio_url and image_url are null
      audioUrl = undefined;
      imageUrl = undefined;
    } else if (type === 'voice') {
      if (!audioUrl) {
        throw new Error("Voice message requires audio URL");
      }
      // For voice messages, content and image_url should be null
      content = null;
      imageUrl = undefined;
    } else if (type === 'image') {
      if (!imageUrl) {
        throw new Error("Image message requires image URL");
      }
      // For image messages, content and audio_url should be null
      content = null;
      audioUrl = undefined;
    }
    
    // Check if the messages table has the new columns
    try {
      // Create message insertion data
      const insertData = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        content: content,
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
      console.error("Error sending message:", error);
      throw error;
    }
    
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};
