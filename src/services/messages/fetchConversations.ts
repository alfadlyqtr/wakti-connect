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
    
    // Start with a base query for profiles
    let query = supabase
      .from('profiles')
      .select('id, full_name, display_name, business_name, avatar_url, account_type');
    
    // If we're filtering for staff only, we need to handle it differently
    if (staffOnly) {
      // For business users, we want to get all staff members
      // Get the business ID (which is the user ID for business accounts)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', user.id)
        .single();
        
      const isBusinessOwner = profileData?.account_type === 'business';
      
      if (isBusinessOwner) {
        // Get all staff IDs for this business directly from business_staff
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('staff_id')
          .eq('business_id', user.id)
          .eq('status', 'active');
          
        if (staffData && Array.isArray(staffData) && staffData.length > 0) {
          // Filter profiles to only include staff members
          const staffIds = staffData.map(staff => staff.staff_id);
          query = query.in('id', staffIds);
        } else {
          // No staff members, return empty array
          return [];
        }
      } else {
        // This could be a staff member trying to see staff-only conversations
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('business_id')
          .eq('staff_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
          
        if (staffData) {
          // Get the business ID
          const businessId = staffData.business_id;
          
          // Get other staff members for the same business
          const { data: otherStaffData } = await supabase
            .from('business_staff')
            .select('staff_id')
            .eq('business_id', businessId)
            .eq('status', 'active')
            .neq('staff_id', user.id);
            
          if (otherStaffData && Array.isArray(otherStaffData) && otherStaffData.length > 0) {
            // Include business owner in the staff-only conversations
            const staffIds = otherStaffData.map(staff => staff.staff_id);
            staffIds.push(businessId); // Add the business owner ID
            
            // Filter profiles to include business owner and other staff members
            query = query.in('id', staffIds);
          } else {
            // Just include the business owner
            query = query.eq('id', businessId);
          }
        } else {
          // Not a staff member, return empty array
          return [];
        }
      }
    } else {
      // For regular conversations (not staff-only), 
      // just get profiles for the partners we have messages with
      query = query.in('id', partnerIds);
    }
    
    // Execute the profiles query
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
    
    // If staffOnly and we're a business account, include all staff, even if no messages yet
    if (staffOnly) {
      profiles?.forEach(profile => {
        const message = conversationPartnersMap.get(profile.id);
        
        conversations.push({
          id: profile.id, // Use partner ID as conversation ID
          userId: profile.id,
          displayName: profile.business_name || profile.display_name || profile.full_name || 'Unknown User',
          avatar: profile.avatar_url || '',
          lastMessage: message?.content || 'No messages yet',
          lastMessageTime: message?.created_at || new Date().toISOString(),
          unread: message ? (message.recipient_id === user.id && !message.is_read) : false
        });
      });
    } else {
      // Regular conversation logic - only include users with messages
      conversationPartnersMap.forEach((message, partnerId) => {
        const profile = profileMap.get(partnerId);
        
        if (profile) {
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
    }
    
    // Sort by message time, newest first
    return conversations.sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
    
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    throw error;
  }
};
