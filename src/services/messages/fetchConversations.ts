import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/message.types";

/**
 * Fetches the list of conversations for the current user
 * @param staffOnly - When true, only returns conversations with staff members (for business accounts)
 * @returns Promise with array of conversations
 */
export const fetchConversations = async (staffOnly: boolean = false): Promise<Conversation[]> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get all messages to/from the user
    // We need to use raw SQL query with supabase.from('messages').select() instead of rpc 
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        recipient_id,
        content,
        is_read,
        created_at
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }

    // Group messages by conversation partner
    const conversationPartnersMap = new Map();
    
    // Keep track of the latest message for each conversation
    if (messages && Array.isArray(messages)) {
      for (const message of messages) {
        const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        
        if (!conversationPartnersMap.has(partnerId) || 
            new Date(message.created_at) > new Date(conversationPartnersMap.get(partnerId).created_at)) {
          conversationPartnersMap.set(partnerId, message);
        }
      }
    }
    
    // Fetch user details for all conversation partners
    const partnerIds = Array.from(conversationPartnersMap.keys());
    
    if (partnerIds.length === 0) {
      return [];
    }
    
    // Fetch profiles for all conversation partners
    let query = supabase
      .from('profiles')
      .select('id, full_name, display_name, business_name, avatar_url, account_type');
    
    // If we're filtering for staff only, join with business_staff to filter
    if (staffOnly) {
      // For business users, we want to get all staff members
      // First check if the user is a business
      const { data: profileData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', user.id)
        .single();
        
      const isBusinessOwner = profileData?.account_type === 'business';
      
      if (isBusinessOwner) {
        // Get list of staff IDs for this business
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('staff_id')
          .eq('business_id', user.id)
          .eq('status', 'active');
          
        if (staffData && Array.isArray(staffData)) {
          const staffIds = staffData.map(staff => staff.staff_id);
          
          // Filter partners to only include staff members
          query = query.in('id', staffIds);
        }
      }
    }
    
    // Add the user IDs filter
    query = query.in('id', partnerIds);
    
    const { data: profiles, error: profilesError } = await query;
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }
    
    // Map profiles to a dictionary for easy lookup
    const profileMap = new Map();
    if (profiles && Array.isArray(profiles)) {
      profiles.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
    }
    
    // Construct the conversations array
    const conversations: Conversation[] = [];
    
    conversationPartnersMap.forEach((message, partnerId) => {
      const profile = profileMap.get(partnerId);
      
      if (profile) {
        // Skip if we're looking for staff only and this is not staffOnly mode
        if (staffOnly && !conversations.some(c => c.userId === partnerId)) {
          // We'll check for staff relationship below, but skip for now
        }
        
        conversations.push({
          id: partnerId, // Use partner ID as conversation ID
          userId: partnerId,
          displayName: profile.business_name || profile.display_name || profile.full_name || 'Unknown User',
          avatar: profile.avatar_url || '',
          lastMessage: message.content,
          lastMessageTime: message.created_at,
          unread: message.recipient_id === user.id && !message.is_read
        });
      }
    });
    
    // Sort by message time, newest first
    return conversations.sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
    
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    throw error;
  }
};
