
import { supabase } from "@/integrations/supabase/client";
import { Task, SubTask } from "./types";

// Fetch tasks owned by the current user
export async function fetchMyTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      subtasks:todo_items(*)
    `)
    .eq('user_id', userId)
    .is('assignee_id', null)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching my tasks:", error);
    throw error;
  }
  
  // Ensure subtasks is always an array
  return (data || []).map(task => ({
    ...task,
    subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
  })) as Task[];
}

// Fetch tasks shared with the current user
export async function fetchSharedTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('shared_tasks')
    .select(`
      task:task_id(
        *,
        subtasks:todo_items(*)
      )
    `)
    .eq('shared_with', userId);
    
  if (error) {
    console.error("Error fetching shared tasks:", error);
    throw error;
  }
  
  // Extract tasks from the nested structure and ensure subtasks is always an array
  return (data || []).map(item => {
    if (!item.task) return null;
    return {
      ...item.task,
      subtasks: Array.isArray(item.task.subtasks) ? item.task.subtasks : []
    };
  }).filter(Boolean) as Task[];
}

// Fetch tasks assigned to the current user (for staff) or by the current user (for business owners)
export async function fetchAssignedTasks(userId: string): Promise<Task[]> {
  const { data: profileData } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', userId)
    .single();
    
  const userRole = profileData?.account_type;
  
  // For business accounts, get tasks they've assigned to staff
  if (userRole === 'business') {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks:todo_items(*),
        assignee:assignee_id(
          id,
          full_name,
          display_name
        )
      `)
      .eq('user_id', userId)
      .not('assignee_id', 'is', null)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching assigned tasks:", error);
      throw error;
    }
    
    // Process the data to ensure subtasks is always an array
    return (data || []).map(task => ({
      ...task,
      subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
    })) as Task[];
  } 
  // For individuals and staff, get tasks assigned to them
  else {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks:todo_items(*),
        assigner:user_id(
          id,
          full_name,
          display_name
        )
      `)
      .eq('assignee_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching tasks assigned to me:", error);
      throw error;
    }
    
    // Process the data to ensure subtasks is always an array
    return (data || []).map(task => ({
      ...task,
      subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
    })) as Task[];
  }
}

// Default fallback - just get all tasks (used if tab is invalid)
export async function fetchDefaultTasks(userId: string): Promise<Task[]> {
  const tasks = await fetchMyTasks(userId);
  return tasks;
}
