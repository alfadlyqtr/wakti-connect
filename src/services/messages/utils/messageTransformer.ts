
import { Message } from "@/types/message.types";
import { UserProfile, StaffProfile } from "@/types/message.types";

/**
 * Transforms raw message data from Supabase into Message objects
 * @param messageData Array of raw message objects from database
 * @param userProfiles Map of user profiles by ID
 * @param staffProfiles Object of staff profiles by ID
 * @returns Array of formatted Message objects
 */
export const transformMessages = (
  messageData: any[],
  userProfiles: Map<string, UserProfile>,
  staffProfiles: Record<string, StaffProfile>
): Message[] => {
  if (!messageData || messageData.length === 0) {
    return [];
  }
  
  return messageData.map(msg => {
    // Get sender information from the profiles map
    const senderProfile = userProfiles.get(msg.sender_id);
    
    // Check if sender is a staff member
    const staffInfo = staffProfiles[msg.sender_id];
    
    // Use staff info if available, otherwise use profile info
    const senderName = 
      staffInfo?.name ||
      senderProfile?.business_name || 
      senderProfile?.display_name || 
      senderProfile?.full_name || 
      'Unknown User';
    
    const senderAvatar = 
      staffInfo?.profile_image_url ||
      senderProfile?.avatar_url;
    
    // Create message object with proper type handling
    return {
      id: msg.id || '',
      content: msg.content || '',
      senderId: msg.sender_id || '',
      recipientId: msg.recipient_id || '',
      isRead: msg.is_read || false,
      createdAt: msg.created_at || '',
      senderName: senderName,
      senderAvatar: senderAvatar,
      type: (msg.message_type as 'text' | 'voice' | 'image') || 'text',
      audioUrl: msg.audio_url,
      imageUrl: msg.image_url
    };
  });
};
