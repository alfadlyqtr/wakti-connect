
import { Message } from "@/types/message.types";
import { isValid } from "date-fns";

/**
 * Transforms raw message data from database into Message objects
 */
export const transformMessages = (
  messageData: any[],
  userProfiles: Map<string, any>,
  staffProfiles: Record<string, any>
): Message[] => {
  return messageData.map(msg => {
    // Validate the timestamp
    const timestamp = new Date(msg.created_at);
    if (!isValid(timestamp)) {
      console.error("Invalid timestamp in message:", msg.id, msg.created_at);
    }
    
    // Get sender profile from either user profiles or staff profiles
    const senderProfile = userProfiles.get(msg.sender_id) || staffProfiles[msg.sender_id];
    
    // Get recipient profile from either user profiles or staff profiles
    const recipientProfile = userProfiles.get(msg.recipient_id) || staffProfiles[msg.recipient_id];
    
    // Get sender name from the appropriate profile
    let senderName = "User";
    if (senderProfile) {
      if ('name' in senderProfile) {
        // Staff profile
        senderName = senderProfile.name;
      } else {
        // User profile
        senderName = senderProfile.business_name || senderProfile.display_name || senderProfile.full_name;
      }
    }
    
    // Get recipient name from the appropriate profile
    let recipientName = "User";
    if (recipientProfile) {
      if ('name' in recipientProfile) {
        // Staff profile
        recipientName = recipientProfile.name;
      } else {
        // User profile
        recipientName = recipientProfile.business_name || recipientProfile.display_name || recipientProfile.full_name;
      }
    }
    
    // Determine message type based on fields
    let messageType: 'text' | 'voice' | 'image' = 'text';
    if (msg.audio_url) {
      messageType = 'voice';
    } else if (msg.image_url) {
      messageType = 'image';
    }
    
    return {
      id: msg.id || '',
      content: msg.content || '',
      senderId: msg.sender_id || '',
      senderName: senderName,
      recipientId: msg.recipient_id || '',
      recipientName: recipientName,
      isRead: msg.is_read || false,
      createdAt: isValid(timestamp) ? msg.created_at : new Date().toISOString(),
      type: msg.message_type || messageType,
      audioUrl: msg.audio_url,
      imageUrl: msg.image_url
    };
  });
};

