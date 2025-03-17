
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";

/**
 * Gets the number of unread messages for the current user
 */
export const getUnreadMessagesCount = async (): Promise<number> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return 0;
    }
    
    // The issue is in this line - select() method expects a single string argument
    // for the query, not a second options object
    const { count, error } = await fromTable('messages')
      .select('*, count')
      .eq('recipient_id', session.user.id)
      .eq('is_read', false)
      .count('exact');
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error("Error getting unread messages count:", error);
    return 0;
  }
};
