
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/message.types";
import { fromTable } from "@/integrations/supabase/helper";

/**
 * Gets a list of conversations for the current user
 */
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // Get messages for the current user
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
