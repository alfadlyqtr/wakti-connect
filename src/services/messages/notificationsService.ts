
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the count of unread messages for the current user
 * 
 * @returns Promise with the count of unread messages
 */
export const getUnreadMessagesCount = async (): Promise<number> => {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user found");
    }
    
    // Count unread messages
    const { count, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', session.user.id)
      .eq('is_read', false);
      
    if (error) {
      console.error("Error counting unread messages:", error);
      throw error;
    }
    
    return count || 0;
    
  } catch (error) {
    console.error("Failed to count unread messages:", error);
    return 0; // Return 0 on error
  }
};
