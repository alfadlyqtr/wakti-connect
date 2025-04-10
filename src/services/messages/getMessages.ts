
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message.types";
import { fetchUserProfiles, fetchStaffProfiles } from "./utils/profileFetcher";
import { transformMessages } from "./utils/messageTransformer";
import { fetchMessagesFromDb } from "./utils/messagesFetcher";

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
    
    // Fetch messages from database
    const filteredData = await fetchMessagesFromDb(session.user.id, conversationUserId);
    
    if (filteredData.length === 0) {
      return [];
    }
    
    // Get all unique user IDs from messages (both senders and recipients)
    const userIds = new Set<string>();
    filteredData.forEach(msg => {
      if (msg.sender_id) userIds.add(msg.sender_id);
      if (msg.recipient_id) userIds.add(msg.recipient_id);
    });
    
    // Fetch profiles for all users in parallel
    const [userProfiles, staffProfiles] = await Promise.all([
      fetchUserProfiles(Array.from(userIds)),
      fetchStaffProfiles(Array.from(userIds))
    ]);
    
    // Transform the raw message data into Message objects
    const messages = transformMessages(filteredData, userProfiles, staffProfiles);
    
    console.log("Returning messages:", messages.length);
    return messages;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
};
