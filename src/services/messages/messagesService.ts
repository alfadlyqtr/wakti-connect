
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message.types";
import { fromTable } from "@/integrations/supabase/helper";

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
    const { data, error } = await fromTable('messages')
      .select(`
        id,
        content,
        sender_id,
        recipient_id,
        is_read,
        created_at,
        profiles!sender_id(display_name, avatar_url)
      `)
      .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Update all unread messages sent by the other user as read
    await fromTable('messages')
      .update({ is_read: true })
      .eq('sender_id', otherUserId)
      .eq('recipient_id', currentUserId)
      .eq('is_read', false);
    
    return data.map(msg => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.sender_id,
      recipientId: msg.recipient_id,
      isRead: msg.is_read,
      createdAt: msg.created_at,
      senderName: msg.profiles?.display_name,
      senderAvatar: msg.profiles?.avatar_url
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

/**
 * Sends a message to another user
 * @param recipientId The ID of the message recipient
 * @param content Message content (limited to 20 characters)
 */
export const sendMessage = async (recipientId: string, content: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    if (content.length > 20) {
      throw new Error("Message content cannot exceed 20 characters");
    }
    
    // Check if user is allowed to send messages
    const { data: profile } = await fromTable('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
    
    if (profile?.account_type === 'free') {
      throw new Error("Free accounts cannot send messages");
    }
    
    // Get recipient profile to check if it exists
    const { data: recipientProfile } = await fromTable('profiles')
      .select('account_type')
      .eq('id', recipientId)
      .maybeSingle();
      
    if (!recipientProfile) {
      throw new Error("Recipient not found");
    }
    
    // If current user is an individual account and recipient is an individual account,
    // check if they are contacts
    if (profile?.account_type === 'individual' && recipientProfile?.account_type === 'individual') {
      const { data: contactData } = await fromTable('user_contacts')
        .select('id')
        .or(`and(user_id.eq.${session.user.id},contact_id.eq.${recipientId},status.eq.accepted),and(user_id.eq.${recipientId},contact_id.eq.${session.user.id},status.eq.accepted)`)
        .maybeSingle();
        
      if (!contactData) {
        throw new Error("You can only message individual users who are in your contacts");
      }
    }
    
    // If current user is an individual account and recipient is a business account,
    // check if user is subscribed to the business
    if (profile?.account_type === 'individual' && recipientProfile?.account_type === 'business') {
      const { data: subscriptionData } = await fromTable('business_subscribers')
        .select('id')
        .eq('subscriber_id', session.user.id)
        .eq('business_id', recipientId)
        .maybeSingle();
        
      if (!subscriptionData) {
        throw new Error("You must be subscribed to this business to send messages");
      }
    }
    
    // Insert the message
    const { error } = await fromTable('messages')
      .insert({
        sender_id: session.user.id,
        recipient_id: recipientId,
        content,
        is_read: false
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Gets a list of conversations for the current user
 */
export const fetchConversations = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // Get the latest message for each unique conversation partner
    // Instead of using RPC, we'll query manually
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        sender_id,
        recipient_id,
        is_read,
        created_at
      `)
      .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!messages || messages.length === 0) {
      return [];
    }
    
    // Process messages to find the latest message for each unique conversation partner
    const conversationPartners = new Map();
    
    messages.forEach(message => {
      const partnerId = message.sender_id === session.user.id 
        ? message.recipient_id 
        : message.sender_id;
        
      if (!conversationPartners.has(partnerId)) {
        conversationPartners.set(partnerId, message);
      }
    });
    
    // Get profile data for conversation partners
    const partnerIds = Array.from(conversationPartners.keys());
    
    if (partnerIds.length === 0) {
      return [];
    }
    
    const { data: profiles } = await fromTable('profiles')
      .select('id, display_name, full_name, avatar_url, account_type, business_name')
      .in('id', partnerIds);
      
    // Combine message data with profile data
    return Array.from(conversationPartners.entries()).map(([partnerId, message]) => {
      const profile = profiles?.find(p => p.id === partnerId);
      
      let displayName = 'Unknown User';
      if (profile) {
        if (profile.account_type === 'business' && profile.business_name) {
          displayName = profile.business_name;
        } else if (profile.display_name) {
          displayName = profile.display_name;
        } else if (profile.full_name) {
          displayName = profile.full_name;
        }
      }
      
      return {
        id: message.id,
        userId: partnerId,
        displayName,
        avatar: profile?.avatar_url,
        lastMessage: message.content,
        lastMessageTime: message.created_at,
        unread: !message.is_read && message.sender_id !== session.user.id
      };
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

/**
 * Checks if the current user can message a given user
 */
export const canMessageUser = async (userId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false;
    }
    
    // Get the current user's profile
    const { data: profile } = await fromTable('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
      
    if (!profile) return false;
    
    // Free users cannot message anyone
    if (profile.account_type === 'free') {
      return false;
    }
    
    // Business users can message anyone
    if (profile.account_type === 'business') {
      return true;
    }
    
    // Get the target user's profile
    const { data: targetProfile } = await fromTable('profiles')
      .select('account_type')
      .eq('id', userId)
      .maybeSingle();
      
    if (!targetProfile) return false;
    
    // Individual users messaging individual users: check contacts
    if (targetProfile.account_type === 'individual') {
      const { data: contactData } = await fromTable('user_contacts')
        .select('id')
        .or(`and(user_id.eq.${session.user.id},contact_id.eq.${userId},status.eq.accepted),and(user_id.eq.${userId},contact_id.eq.${session.user.id},status.eq.accepted)`)
        .maybeSingle();
        
      return !!contactData;
    }
    
    // Individual users messaging business: check subscription
    if (targetProfile.account_type === 'business') {
      const { data: subscriptionData } = await fromTable('business_subscribers')
        .select('id')
        .eq('subscriber_id', session.user.id)
        .eq('business_id', userId)
        .maybeSingle();
        
      return !!subscriptionData;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return false;
  }
};

/**
 * Gets the number of unread messages for the current user
 */
export const getUnreadMessagesCount = async (): Promise<number> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return 0;
    }
    
    const { count, error } = await fromTable('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', session.user.id)
      .eq('is_read', false);
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error("Error getting unread messages count:", error);
    return 0;
  }
};
