
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
    
    // First try to fetch with new schema (with message_type column)
    try {
      // Get all conversations
      const { data: messageData, error } = await supabase
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
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) {
        throw error;
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
              
            if (otherStaff) {
              filteredContactIds = [...filteredContactIds, ...otherStaff.map(s => s.staff_id)];
            }
          }
        }
      }
      
      // Process messages into conversations
      const conversationMap = new Map<string, Conversation>();
      
      for (const msg of messageData) {
        if (!msg || typeof msg !== 'object') continue;
        
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
          const displayName = (profileData as any)?.business_name || 
                             (profileData as any)?.display_name || 
                             (profileData as any)?.full_name || 
                             'Unknown User';
          
          // Check if there are any unread messages from this user
          const isUnread = msg.recipient_id === session.user.id && !msg.is_read;
          
          conversationMap.set(otherUserId, {
            id: otherUserId,
            userId: otherUserId,
            displayName,
            avatar: (profileData as any)?.avatar_url,
            lastMessage: msg.content || '',
            lastMessageTime: msg.created_at || new Date().toISOString(),
            unread: isUnread
          });
        }
      }
      
      // Sort conversations by last message time (newest first)
      return Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
    
    } catch (schemaError) {
      console.log("Error with new schema, falling back to old schema:", schemaError);
      
      // Fallback to old schema without message_type
      const { data: messageData, error } = await supabase
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
        .order('created_at', { ascending: false })
        .limit(500);
        
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
              
            if (otherStaff) {
              filteredContactIds = [...filteredContactIds, ...otherStaff.map(s => s.staff_id)];
            }
          }
        }
      }
      
      // Process messages into conversations
      const conversationMap = new Map<string, Conversation>();
      
      for (const msg of messageData) {
        if (!msg || typeof msg !== 'object') continue;
        
        const typedMsg = msg as any;
        
        // Determine the other user ID (conversation partner)
        const otherUserId = typedMsg.sender_id === session.user.id 
          ? typedMsg.recipient_id 
          : typedMsg.sender_id;
        
        // Skip if this is not a staff conversation when staffOnly is true
        if (staffOnly && !filteredContactIds.includes(otherUserId)) {
          continue;
        }
        
        // Get profile data for the other user
        const profileData = typedMsg.sender_id === session.user.id 
          ? typedMsg.recipient 
          : typedMsg.sender;
          
        if (!profileData) continue;
        
        // If this conversation hasn't been processed yet or this message is newer
        if (!conversationMap.has(otherUserId) || 
            (new Date(typedMsg.created_at) > new Date(conversationMap.get(otherUserId)!.lastMessageTime))) {
          
          // Format display name (business name > display name > full name)
          const displayName = (profileData as any)?.business_name || 
                             (profileData as any)?.display_name || 
                             (profileData as any)?.full_name || 
                             'Unknown User';
          
          // Check if there are any unread messages from this user
          const isUnread = typedMsg.recipient_id === session.user.id && !typedMsg.is_read;
          
          conversationMap.set(otherUserId, {
            id: otherUserId,
            userId: otherUserId,
            displayName,
            avatar: (profileData as any)?.avatar_url,
            lastMessage: typedMsg.content || '',
            lastMessageTime: typedMsg.created_at || new Date().toISOString(),
            unread: isUnread
          });
        }
      }
      
      // Sort conversations by last message time (newest first)
      return Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};
