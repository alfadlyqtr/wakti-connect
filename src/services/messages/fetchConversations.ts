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
    
    // Get the user's role and business ID if they are staff
    const isStaff = localStorage.getItem('userRole') === 'staff';
    let userBusinessId = null;
    
    if (isStaff) {
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('business_id')
        .eq('staff_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
        
      if (staffData) {
        userBusinessId = staffData.business_id;
      }
    }
    
    // Start with a base query for profiles
    let query = supabase
      .from('profiles')
      .select('id, full_name, display_name, business_name, avatar_url, account_type');
    
    // If we're filtering for staff only, we need to handle it differently
    if (staffOnly) {
      // Get the user profile to determine if they are a business owner
      const { data: profileData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', user.id)
        .single();
        
      const isBusinessOwner = profileData?.account_type === 'business';
      
      if (isBusinessOwner) {
        // Business owners see their staff
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('staff_id')
          .eq('business_id', user.id)
          .eq('status', 'active');
          
        if (staffData && Array.isArray(staffData) && staffData.length > 0) {
          // Filter profiles to only include active staff members
          const staffIds = staffData.map(staff => staff.staff_id);
          query = query.in('id', staffIds);
        } else {
          // No staff members, return empty array
          return [];
        }
      } else if (isStaff && userBusinessId) {
        // Staff members see their business owner and other staff
        const businessOwnerId = userBusinessId;
        
        // Get other staff members for the same business
        const { data: otherStaffData } = await supabase
          .from('business_staff')
          .select('staff_id')
          .eq('business_id', businessOwnerId)
          .eq('status', 'active')
          .neq('staff_id', user.id);
          
        // Include the business owner and other staff
        const profileIds = otherStaffData 
          ? [businessOwnerId, ...otherStaffData.map(s => s.staff_id)]
          : [businessOwnerId];
          
        query = query.in('id', profileIds);
      } else {
        // Not a business owner or staff member, return empty array
        return [];
      }
    } else {
      // For regular conversations, get profiles for the partners we have messages with
      const partnerIds = Array.from(conversationPartnersMap.keys());
      
      if (partnerIds.length === 0) {
        return [];
      }
      
      query = query.in('id', partnerIds);
    }
    
    // Execute the profiles query
    const { data: profiles, error: profilesError } = await query;
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }
    
    if (!profiles || !Array.isArray(profiles)) {
      console.warn("No profiles found");
      return [];
    }
    
    // Get business staff information for profiles that might be staff
    const profileIdsToCheck = profiles.map(p => p.id);
    
    const { data: staffProfiles } = await supabase
      .from('business_staff')
      .select('staff_id, name, profile_image_url')
      .in('staff_id', profileIdsToCheck)
      .eq('status', 'active');
      
    // Create a map of staff profiles by staff_id
    const staffProfileMap = new Map();
    if (staffProfiles && Array.isArray(staffProfiles)) {
      staffProfiles.forEach(staff => {
        staffProfileMap.set(staff.staff_id, {
          name: staff.name,
          profile_image_url: staff.profile_image_url
        });
      });
    }
    
    // Map profiles to a dictionary for easy lookup and enhance with staff info
    const profileMap = new Map();
    if (profiles && Array.isArray(profiles)) {
      profiles.forEach(profile => {
        const staffInfo = staffProfileMap.get(profile.id);
        
        profileMap.set(profile.id, {
          ...profile,
          // If this user is also a staff member, use staff name if available
          display_name: staffInfo?.name || profile.display_name,
          avatar_url: staffInfo?.profile_image_url || profile.avatar_url
        });
      });
    }
    
    // Construct the conversations array
    const conversations: Conversation[] = [];
    
    // If staffOnly and we're a business account, include all staff, even if no messages yet
    if (staffOnly) {
      profiles?.forEach(profile => {
        const message = conversationPartnersMap.get(profile.id);
        const staffInfo = staffProfileMap.get(profile.id);
        
        conversations.push({
          id: profile.id, // Use partner ID as conversation ID
          userId: profile.id,
          displayName: staffInfo?.name || profile.business_name || profile.display_name || profile.full_name || 'Unknown User',
          avatar: staffInfo?.profile_image_url || profile.avatar_url || '',
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
          const staffInfo = staffProfileMap.get(partnerId);
          
          conversations.push({
            id: partnerId, // Use partner ID as conversation ID
            userId: partnerId,
            displayName: staffInfo?.name || 
                       profile.business_name || 
                       profile.display_name || 
                       profile.full_name || 
                       'Unknown User',
            avatar: staffInfo?.profile_image_url || profile.avatar_url || '',
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
    return [];
  }
};
