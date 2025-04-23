
import { supabase } from "@/integrations/supabase/client";

// This function will remove tasks that have been archived for more than 10 days
export async function cleanupArchivedTasks() {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .lt('archived_at', tenDaysAgo.toISOString())
      .not('archived_at', 'is', null)
      .select();
      
    if (error) throw error;
    
    console.log(`Cleaned up ${data?.length || 0} archived tasks older than 10 days`);
    return { success: true, count: data?.length || 0 };
  } catch (error) {
    console.error("Error cleaning up archived tasks:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
