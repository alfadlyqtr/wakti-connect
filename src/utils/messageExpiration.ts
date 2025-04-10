
/**
 * Checks if a message is expired (older than 24 hours)
 * @param timestamp The timestamp to check
 * @returns boolean indicating if the message is expired
 */
export const isMessageExpired = (timestamp: string): boolean => {
  try {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    // Calculate difference in milliseconds
    const differenceMs = now.getTime() - messageDate.getTime();
    
    // 24 hours in milliseconds
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;
    
    return differenceMs >= twentyFourHoursMs;
  } catch {
    // If there's an error parsing the date, assume it's expired
    return true;
  }
};

/**
 * Checks and cleans up expired messages (older than 24 hours)
 * This function can be called periodically to ensure messages don't stay longer than 24 hours
 */
export const cleanupExpiredMessages = async (): Promise<void> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { error } = await supabase.rpc('expire_old_messages');
    
    if (error) {
      console.error("Error cleaning up expired messages:", error);
    } else {
      console.log("Successfully cleaned up expired messages");
    }
  } catch (error) {
    console.error("Error in message cleanup process:", error);
  }
};
