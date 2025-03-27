
import { supabase } from "@/integrations/supabase/client";

// This function will remove tasks that have been archived for more than 7 days
export async function cleanupArchivedTasks() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .lt('archived_at', sevenDaysAgo.toISOString())
      .not('archived_at', 'is', null)
      .select();
      
    if (error) throw error;
    
    console.log(`Cleaned up ${data?.length || 0} archived tasks older than 7 days`);
    return { success: true, count: data?.length || 0 };
  } catch (error) {
    console.error("Error cleaning up archived tasks:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
