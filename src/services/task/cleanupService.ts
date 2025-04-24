
import { supabase } from "@/integrations/supabase/client";

export async function cleanupCompletedTasks() {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('status', 'completed')
      .lt('completed_at', tenDaysAgo.toISOString())
      .select();
      
    if (error) throw error;
    
    console.log(`Cleaned up ${data?.length || 0} completed tasks older than 10 days`);
    return { success: true, count: data?.length || 0 };
  } catch (error) {
    console.error("Error cleaning up completed tasks:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
