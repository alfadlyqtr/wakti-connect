import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/message.types";
import { formatDistanceToNow } from "date-fns";

export const fetchConversations = async (staffOnly: boolean = false): Promise<Conversation[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user found");
    }
    
    const currentUserId = session.user.id;
    const isStaff = localStorage.getItem('userRole') === 'staff';
    
    // Get all messages to/from the current user
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        recipient_id,
        content,
        is_read,
        created_at,
        message_type,
        sender:sender_id(id, full_name, display_name, business_name, avatar_url),
        recipient:recipient_id(id, full_name, display_name, business_name, avatar_url)
      `)
      .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
      .order('created_at', { ascending: false });
      
    if (messagesError) {
      throw messagesError;
    }
    
    // Get staff records for staff-specific handling
    let staffProfiles: Record<string, any> = {};
    
    if (isStaff || staffOnly) {
      let businessId = currentUserId;
      
      // If current user is staff, get their business ID
      if (isStaff) {
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('business_id')
          .eq('staff_id', currentUserId)
          .eq('status', 'active')
          .maybeSingle();
          
        if (staffData?.business_id) {
          businessId = staffData.business_id;
        }
      }
      
      // Get all staff for this business
      const { data: allStaffData } = await supabase
        .from('business_staff')
        .select('staff_id, name, profile_image_url, business_id')
        .eq('status', 'active')
        .or(`business_id.eq.${businessId},staff_id.eq.${currentUserId}`);
        
      if (allStaffData) {
        allStaffData.forEach(staff => {
          staffProfiles[staff.staff_id] = {
            name: staff.name,
            avatar_url: staff.profile_image_url,
            business_id: staff.business_id
          };
        });
      }
    }
    
    // Process messages into conversations
    const conversations: Record<string, any> = {};
    
    messagesData?.forEach(message => {
      // Determine the other user in the conversation
      const otherUserId = message.sender_id === currentUserId ? message.recipient_id : message.sender_id;
      
      // Skip if we're only looking for staff conversations and this isn't one
      if (staffOnly) {
        const isStaffConversation = 
          staffProfiles[otherUserId] || // Other user is staff
          (isStaff && staffProfiles[currentUserId]?.business_id === otherUserId); // Other user is the business
          
        if (!isStaffConversation) {
          return;
        }
      }
      
      // Initialize conversation if this is the first message
      if (!conversations[otherUserId]) {
        // Get user info for display
        let displayName = 'Unknown User';
        let avatar = undefined;
        
        // Check if this is a staff member
        if (staffProfiles[otherUserId]) {
          displayName = staffProfiles[otherUserId].name;
          avatar = staffProfiles[otherUserId].avatar_url;
        } else {
          // Otherwise get from profiles
          const userInfo = message.sender_id === otherUserId ? message.sender : message.recipient;
          
          if (userInfo) {
            displayName = 
              userInfo.business_name || 
              userInfo.display_name || 
              userInfo.full_name || 
              'Unknown User';
            
            avatar = userInfo.avatar_url;
          }
        }
        
        conversations[otherUserId] = {
          id: otherUserId,
          userId: otherUserId,
          displayName,
          avatar,
          messages: [],
          unread: false
        };
      }
      
      // Track if conversation has unread messages
      if (message.recipient_id === currentUserId && !message.is_read) {
        conversations[otherUserId].unread = true;
      }
      
      // Add message to conversation
      conversations[otherUserId].messages.push(message);
    });
    
    // Format conversations for return
    return Object.values(conversations)
      .map((convo: any) => {
        // Get the latest message
        const latestMessage = convo.messages[0];
        
        // Format the last message content based on type
        let lastMessage = latestMessage.content;
        if (latestMessage.message_type === 'voice') {
          lastMessage = '🎤 Voice message';
        } else if (latestMessage.message_type === 'image') {
          lastMessage = '📷 Image' + (latestMessage.content ? `: ${latestMessage.content}` : '');
        }
        
        return {
          id: convo.id,
          userId: convo.userId,
          displayName: convo.displayName,
          avatar: convo.avatar,
          lastMessage,
          lastMessageTime: formatDistanceToNow(new Date(latestMessage.created_at), { addSuffix: true }),
          unread: convo.unread
        } as Conversation;
      })
      .sort((a, b) => {
        // Show unread conversations first
        if (a.unread && !b.unread) return -1;
        if (!a.unread && b.unread) return 1;
        return 0;
      });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};
