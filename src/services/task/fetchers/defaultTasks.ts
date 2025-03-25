
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";
import { validateTaskStatus, validateTaskPriority } from "../utils/statusValidator";

/**
 * Fetches default tasks list (fallback)
 */
export async function fetchDefaultTasks(userId: string): Promise<Task[]> {
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
    status: validateTaskStatus(item.status || "pending") as TaskStatus,
    priority: validateTaskPriority(item.priority || "normal") as TaskPriority,
    due_date: item.due_date,
    due_time: item.due_time || null,
    user_id: item.user_id,
    assignee_id: item.assignee_id || null,
    created_at: item.created_at,
    updated_at: item.updated_at,
    completed_at: item.completed_at || null,
    is_recurring_instance: item.is_recurring_instance || false,
    parent_recurring_id: item.parent_recurring_id || null,
    snooze_count: item.snooze_count || 0,
    snoozed_until: item.snoozed_until || null
  }));
}
