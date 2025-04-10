
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message.types";

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
      
    let messageData;
    let error;
    
    if (columnCheckError) {
      console.log("Using legacy message schema without message_type");
      // Use legacy schema query without relationship syntax
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
        .order('created_at');
        
      messageData = result.data;
      error = result.error;
    } else {
      // Use new schema with message_type without relationship syntax
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
        .order('created_at');
        
      messageData = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
    
    // If no data or empty array, return empty array
    if (!messageData || messageData.length === 0) {
      console.log("No messages found");
      return [];
    }
    
    // If a specific conversation user is provided, filter for only messages between the current user and that user
    let filteredData = messageData;
    
    if (conversationUserId) {
      filteredData = messageData.filter(msg => {
        const isMatch =
          (msg.sender_id === session.user.id && msg.recipient_id === conversationUserId) ||
          (msg.sender_id === conversationUserId && msg.recipient_id === session.user.id);

        if (!isMatch) {
          console.log("Filtered out message:", msg);
        }

        return isMatch;
      });
    }
    
    console.log("Total messages fetched:", messageData.length);
    console.log("Messages after filtering:", filteredData.length);
    
    // Get all unique user IDs from messages (both senders and recipients)
    const userIds = new Set<string>();
    filteredData.forEach(msg => {
      userIds.add(msg.sender_id);
      userIds.add(msg.recipient_id);
    });
    
    // Fetch profile data for all users in a single query
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, display_name, business_name, avatar_url')
      .in('id', Array.from(userIds));
      
    // Create a map of profiles for easy lookup
    const profilesMap = new Map();
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }
    
    // Check if these are staff messages
    const isStaff = localStorage.getItem('userRole') === 'staff';
    
    // Get staff profiles if needed
    let staffProfiles: Record<string, any> = {};
    
    if (conversationUserId) {
      // Step 1: Log exactly what values being passed
      const staffIdsArray = [conversationUserId, session.user.id];
      console.log("Fetching staff profiles for array:", staffIdsArray);
      
      // Step 2: Confirm both IDs are non-null
      const validIds = staffIdsArray.filter(id => id != null && id !== undefined);
      console.log("Valid IDs for staff query:", validIds);
      
      if (validIds.length > 0) {
        try {
          // Step 3 & 4: Try multiple approaches
          // First attempt: using .in() with properly filtered array
          const { data: staffData, error: staffError } = await supabase
            .from('business_staff')
            .select('staff_id, name, profile_image_url')
            .in('staff_id', validIds)
            .eq('status', 'active');
          
          if (staffError) {
            console.error("Error with .in() query:", staffError);
            
            // Fallback to individual queries if .in() fails
            console.log("Trying fallback individual queries...");
            const staffResults = await Promise.all(
              validIds.map(async (id) => {
                const { data } = await supabase
                  .from('business_staff')
                  .select('staff_id, name, profile_image_url')
                  .eq('staff_id', id)
                  .eq('status', 'active');
                return data || [];
              })
            );
            
            // Flatten results from individual queries
            const combinedStaffData = staffResults.flat();
            console.log("Staff data from fallback queries:", combinedStaffData);
            
            if (combinedStaffData && combinedStaffData.length > 0) {
              console.log("Staff profiles found via fallback:", combinedStaffData.length);
              combinedStaffData.forEach(staff => {
                staffProfiles[staff.staff_id] = {
                  name: staff.name,
                  avatar_url: staff.profile_image_url
                };
              });
            }
          } else if (staffData && Array.isArray(staffData)) {
            console.log("Staff profiles found via .in():", staffData.length, staffData);
            staffData.forEach(staff => {
              staffProfiles[staff.staff_id] = {
                name: staff.name,
                avatar_url: staff.profile_image_url
              };
            });
          }
        } catch (queryError) {
          console.error("Critical error fetching staff profiles:", queryError);
        }
      } else {
        console.log("No valid IDs for staff query");
      }
    }
    
    // Transform the data to match the Message interface
    const messages: Message[] = filteredData.map(msg => {
      // Get sender information from the profiles map
      const senderProfile = profilesMap.get(msg.sender_id);
      
      // Check if sender is a staff member
      const staffInfo = staffProfiles[msg.sender_id];
      
      // Use staff info if available, otherwise use profile info
      const senderName = 
        staffInfo?.name ||
        senderProfile?.business_name || 
        senderProfile?.display_name || 
        senderProfile?.full_name || 
        'Unknown User';
      
      const senderAvatar = 
        staffInfo?.avatar_url ||
        senderProfile?.avatar_url;
      
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
    
    console.log("Returning messages:", messages);
    return messages;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
};
