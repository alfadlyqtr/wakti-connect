
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority, SubTask } from "../types";

/**
 * Fetches tasks assigned to the current user
 */
export async function fetchAssignedTasks(userId: string): Promise<Task[]> {
  // First, get the user's account type to determine how to fetch tasks
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
      
    if (error) throw error;
    
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
      .order('due_date', { ascending: true });
      
    if (error) throw error;
    
    // Transform data with proper typing and ensure subtasks is always an array
    return (data || []).map(task => ({
      ...task,
      subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
    })) as Task[];
  }
}
