
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message.types";

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
    
    // Insert the message
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: session.user.id,
        recipient_id: recipientId,
        content,
        is_read: false,
        message_type: type,
        audio_url: audioUrl,
        image_url: imageUrl
      })
      .select('id');
    
    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }
    
    console.log("Message sent successfully:", data);
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
    console.log("Getting messages for conversation with:", conversationUserId);
    
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log("No authenticated user found");
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
        message_type,
        audio_url,
        image_url,
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
    
    console.log(`Retrieved ${data?.length || 0} messages for conversation with ${conversationUserId || 'all users'}`);
    
    // Check if these are staff messages
    const isStaff = localStorage.getItem('userRole') === 'staff';
    
    // Get staff profiles if needed
    let staffProfiles: Record<string, any> = {};
    
    if (conversationUserId) {
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('staff_id, name, profile_image_url')
        .or(`staff_id.eq.${conversationUserId},staff_id.eq.${session.user.id}`)
        .eq('status', 'active');
        
      if (staffData && Array.isArray(staffData)) {
        console.log("Staff profiles found:", staffData.length);
        staffData.forEach(staff => {
          staffProfiles[staff.staff_id] = {
            name: staff.name,
            avatar_url: staff.profile_image_url
          };
        });
      }
    }
    
    // Transform the data to match the Message interface
    const messages: Message[] = data?.map(msg => {
      // Get sender information with safe property access
      const senderInfo = msg.sender || {};
      
      // Check if sender is a staff member
      const staffInfo = staffProfiles[msg.sender_id];
      
      // Use staff info if available, otherwise use profile info
      // Add proper null checking to avoid TypeScript errors
      const senderName = 
        staffInfo?.name ||
        (senderInfo && typeof senderInfo === 'object' ? (senderInfo as any)?.business_name : undefined) || 
        (senderInfo && typeof senderInfo === 'object' ? (senderInfo as any)?.display_name : undefined) || 
        (senderInfo && typeof senderInfo === 'object' ? (senderInfo as any)?.full_name : undefined) || 
        'Unknown User';
      
      const senderAvatar = 
        staffInfo?.avatar_url ||
        (senderInfo && typeof senderInfo === 'object' ? (senderInfo as any)?.avatar_url : undefined);
      
      return {
        id: msg.id || '',
        content: msg.content || '',
        senderId: msg.sender_id || '',
        recipientId: msg.recipient_id || '',
        isRead: msg.is_read || false,
        createdAt: msg.created_at || '',
        senderName: senderName,
        senderAvatar: senderAvatar,
        type: msg.message_type as 'text' | 'voice' | 'image' || 'text',
        audioUrl: msg.audio_url,
        imageUrl: msg.image_url
      };
    }) || [];
    
    return messages;
    
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
};
