
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/message.types";
import { isUserStaff, getStaffBusinessId } from "@/utils/staffUtils";

/**
 * Fetches all conversations for the current user
 * 
 * @param staffOnly Whether to only include staff conversations
 * @returns Promise with array of conversations
 */
export const fetchConversations = async (staffOnly = false): Promise<Conversation[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log("No authenticated user found");
      return [];
    }
    
    // Check if the message_type column exists
    const { error: columnCheckError } = await supabase
      .from('messages')
      .select('message_type')
      .limit(1);
      
    let messageData;
    let error;
    
    if (columnCheckError) {
      console.log("Using legacy schema for conversations");
      // Use legacy schema query with explicit joins instead of relationship syntax
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
        .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false })
        .limit(500);
        
      messageData = result.data;
      error = result.error;
      
      // If we have data, fetch profile information separately for senders and recipients
      if (messageData && messageData.length > 0) {
        // Get unique user IDs from messages (both senders and recipients)
        const userIds = new Set<string>();
        messageData.forEach(msg => {
          userIds.add(msg.sender_id);
          userIds.add(msg.recipient_id);
        });
        
        // Fetch profiles for all these users
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, display_name, business_name, avatar_url')
          .in('id', Array.from(userIds));
          
        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }
        
        // Append profile data to messages
        messageData = messageData.map(msg => ({
          ...msg,
          sender: profilesMap.get(msg.sender_id) || null,
          recipient: profilesMap.get(msg.recipient_id) || null
        }));
      }
    } else {
      console.log("Using new schema with message_type");
      // Use new schema with message_type and explicit joins
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
        .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false })
        .limit(500);
        
      messageData = result.data;
      error = result.error;
      
      // If we have data, fetch profile information separately
      if (messageData && messageData.length > 0) {
        // Get unique user IDs from messages
        const userIds = new Set<string>();
        messageData.forEach(msg => {
          userIds.add(msg.sender_id);
          userIds.add(msg.recipient_id);
        });
        
        // Fetch profiles for all these users
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, display_name, business_name, avatar_url')
          .in('id', Array.from(userIds));
          
        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }
        
        // Append profile data to messages
        messageData = messageData.map(msg => ({
          ...msg,
          sender: profilesMap.get(msg.sender_id) || null,
          recipient: profilesMap.get(msg.recipient_id) || null
        }));
      }
    }
    
    if (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }
    
    if (!messageData || messageData.length === 0) {
      return [];
    }
    
    // For staff member filtering
    let staffBusinessId: string | null = null;
    let filteredContactIds: string[] = [];
    
    if (staffOnly) {
      const userIsStaff = await isUserStaff();
      
      if (userIsStaff) {
        // If user is staff, get their business ID
        staffBusinessId = await getStaffBusinessId();
        
        if (staffBusinessId) {
          // Get the business owner ID (same as business ID)
          filteredContactIds.push(staffBusinessId);
          
          // Get IDs of other staff members
          const { data: otherStaff } = await supabase
            .from('business_staff')
            .select('staff_id')
            .eq('business_id', staffBusinessId)
            .neq('staff_id', session.user.id)
            .eq('status', 'active');
            
          if (otherStaff && otherStaff.length > 0) {
            filteredContactIds = [...filteredContactIds, ...otherStaff.map(s => s.staff_id)];
          }
        }
      }
    }
    
    // Process messages into conversations
    const conversationMap = new Map<string, Conversation>();
    
    for (const msg of messageData) {
      if (!msg) continue;
      
      // Determine the other user ID (conversation partner)
      const otherUserId = msg.sender_id === session.user.id 
        ? msg.recipient_id 
        : msg.sender_id;
      
      // Skip if this is not a staff conversation when staffOnly is true
      if (staffOnly && !filteredContactIds.includes(otherUserId)) {
        continue;
      }
      
      // Get profile data for the other user
      const profileData = msg.sender_id === session.user.id 
        ? msg.recipient 
        : msg.sender;
        
      if (!profileData) continue;
      
      // If this conversation hasn't been processed yet or this message is newer
      if (!conversationMap.has(otherUserId) || 
          (new Date(msg.created_at) > new Date(conversationMap.get(otherUserId)!.lastMessageTime))) {
        
        // Format display name (business name > display name > full name)
        const displayName = profileData?.business_name || 
                           profileData?.display_name || 
                           profileData?.full_name || 
                           'Unknown User';
        
        // Check if there are any unread messages from this user
        const isUnread = msg.recipient_id === session.user.id && !msg.is_read;
        
        // Format the last message preview based on the message type
        let lastMessage = msg.content || '';
        if (msg.message_type === 'voice') {
          lastMessage = 'Voice Message';
        } else if (msg.message_type === 'image') {
          lastMessage = 'Image Message';
        }
        
        conversationMap.set(otherUserId, {
          id: otherUserId,
          userId: otherUserId,
          displayName,
          avatar: profileData?.avatar_url,
          lastMessage,
          lastMessageTime: msg.created_at || new Date().toISOString(),
          unread: isUnread
        });
      }
    }
    
    // Sort conversations by last message time (newest first)
    return Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
    
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};
