
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "../types";

/**
 * Fetches tasks created by the current user
 */
export async function fetchMyTasks(userId: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks:todo_items(*)
      `)
      .eq('user_id', userId)
      .is('assignee_id', null)
      .order('due_date', { ascending: true });
      
    if (error) throw error;
    
    // Transform data with proper typing and ensure subtasks is always an array
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
      updated_at: item.updated_at,
      is_recurring_instance: item.is_recurring_instance || false,
      parent_recurring_id: item.parent_recurring_id || null,
      subtasks: Array.isArray(item.subtasks) ? item.subtasks : []
    }));
  } catch (error) {
    console.error("Error fetching my tasks:", error);
    return [];
  }
}
