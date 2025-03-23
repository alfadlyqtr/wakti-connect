import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/message.types";

/**
 * Fetches all conversations for the current user
 */
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const currentUserId = session.user.id;
    
    // First get the latest message for each conversation
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        sender_id,
        recipient_id,
        is_read,
        created_at
      `)
      .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
      .order('created_at', { ascending: false });
    
    if (messagesError) throw messagesError;
    
    if (!messagesData || messagesData.length === 0) {
      return [];
    }
    
    // Use a Map to keep track of the latest message per conversation partner
    const latestMessageByUser = new Map<string, any>();
    
    messagesData.forEach(message => {
      const partnerId = message.sender_id === currentUserId ? message.recipient_id : message.sender_id;
      
      if (!latestMessageByUser.has(partnerId)) {
        latestMessageByUser.set(partnerId, message);
      }
    });
    
    // Get profile information for all conversation partners
    const partnerIds = Array.from(latestMessageByUser.keys());
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name, full_name, avatar_url')
      .in('id', partnerIds);
      
    if (profilesError) throw profilesError;
    
    // Create a map for easy profile lookup
    const profilesMap = new Map();
    profilesData?.forEach(profile => {
      profilesMap.set(profile.id, profile);
    });
    
    // Build the final conversations list
    const conversations: Conversation[] = [];
    
    latestMessageByUser.forEach((message, partnerId) => {
      const profile = profilesMap.get(partnerId);
      
      if (profile) {
        const displayName = profile.display_name || profile.full_name || 'Unknown User';
        
        conversations.push({
          id: message.id,
          userId: partnerId,
          displayName: displayName,
          avatar: profile.avatar_url,
          lastMessage: message.content,
          lastMessageTime: message.created_at,
          unread: message.recipient_id === currentUserId && !message.is_read
        });
      }
    });
    
    // Sort by most recent message
    return conversations.sort((a, b) => {
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};
