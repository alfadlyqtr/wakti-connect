
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message.types";
import { isUserStaff, getStaffBusinessId } from "@/utils/staffUtils";

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
    
    // First check if the message_type column exists
    const { error: columnCheckError } = await supabase
      .from('messages')
      .select('message_type')
      .limit(1);
      
    let data;
    let error;
    
    if (columnCheckError) {
      console.log("Using legacy message schema without message_type");
      // Use legacy schema query
      const result = await supabase
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
        
      data = result.data;
      error = result.error;
    } else {
      // Use new schema with message_type
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
          image_url,
          sender:sender_id(id, full_name, display_name, business_name, avatar_url),
          recipient:recipient_id(id, full_name, display_name, business_name, avatar_url)
        `)
        .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
        .order('created_at');
        
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
    
    // If no data or empty array, return empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // If a specific conversation user is provided, filter for only messages between the current user and that user
    let filteredData = data;
    
    if (conversationUserId) {
      filteredData = data.filter(msg => {
        return (
          (msg.sender_id === session.user.id && msg.recipient_id === conversationUserId) ||
          (msg.sender_id === conversationUserId && msg.recipient_id === session.user.id)
        );
      });
    }
    
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
    const messages: Message[] = filteredData.map(msg => {
      // Get sender information
      const senderInfo = msg.sender || {};
      
      // Check if sender is a staff member
      const staffInfo = staffProfiles[msg.sender_id];
      
      // Use staff info if available, otherwise use profile info
      const senderName = 
        staffInfo?.name ||
        senderInfo?.business_name || 
        senderInfo?.display_name || 
        senderInfo?.full_name || 
        'Unknown User';
      
      const senderAvatar = 
        staffInfo?.avatar_url ||
        senderInfo?.avatar_url;
      
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
    
    return messages;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
};
