
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";

export async function fetchMyTasks(userId: string): Promise<TaskWithSharedInfo[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subtasks:todo_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data || [];
}
