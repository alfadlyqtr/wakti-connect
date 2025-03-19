
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";

/**
 * Fetches tasks created by the current user
 */
export async function fetchMyTasks(
  userId: string, 
  filterStatus: string = "all", 
  filterPriority: string = "all", 
  searchQuery: string = ""
): Promise<Task[]> {
  try {
    // Build the query
    let query = supabase
      .from('tasks')
      .select(`
        *,
        subtasks:todo_items(*)
      `)
      .eq('user_id', userId)
      .is('assignee_id', null);
    
    // Apply status filter if needed
    if (filterStatus !== "all") {
      query = query.eq('status', filterStatus);
    }
    
    // Apply priority filter if needed
    if (filterPriority !== "all") {
      query = query.eq('priority', filterPriority);
    }
    
    // Apply search filter if needed
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }
    
    // Get data
    const { data, error } = await query.order('due_date', { ascending: true });
      
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

// For backward compatibility
export const getMyTasks = fetchMyTasks;
