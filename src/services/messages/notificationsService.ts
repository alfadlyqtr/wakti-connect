
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the count of unread messages for the current user
 * @returns Promise with the count of unread messages
 */
export const getUnreadMessagesCount = async (): Promise<number> => {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return 0;
    }
    
    // Count unread messages where user is recipient
    const { count, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', session.user.id)
      .eq('is_read', false);
    
    if (error) {
      console.error("Error fetching unread message count:", error);
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Failed to fetch unread message count:", error);
    return 0;
  }
};
