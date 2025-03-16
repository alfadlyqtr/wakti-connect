
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "../types";

/**
 * Fetches tasks created by the current user
 */
export async function fetchMyTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true });
    
  if (error) throw error;
  
  // Transform data with proper typing
  return (data || []).map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    status: (item.status || "pending") as TaskStatus,
    priority: (item.priority || "normal") as TaskPriority,
    due_date: item.due_date,
    user_id: item.user_id,
    assignee_id: item.assignee_id || null,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
}
