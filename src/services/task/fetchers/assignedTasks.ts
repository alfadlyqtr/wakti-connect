
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";

/**
 * Fetches tasks assigned to the current user
 */
export async function fetchAssignedTasks(
  userId: string,
  filterStatus: string = "all", 
  filterPriority: string = "all", 
  searchQuery: string = ""
): Promise<Task[]> {
  try {
    // First, get the user's account type to determine how to fetch tasks
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return [];
    }
    
    const userRole = profileData?.account_type;
    
    let tasksData: Task[] = [];
    
    // For business accounts, get tasks they've assigned to staff
    if (userRole === 'business') {
      // Build the query
      let query = supabase
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
        .not('assignee_id', 'is', null);
      
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
      const { data, error } = await query.order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Process the data to ensure subtasks is always an array
      tasksData = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: (task.status || "pending") as TaskStatus,
        priority: (task.priority || "normal") as TaskPriority,
        due_date: task.due_date,
        user_id: task.user_id,
        assignee_id: task.assignee_id || null,
        created_at: task.created_at,
        updated_at: task.updated_at,
        is_recurring_instance: task.is_recurring_instance || false,
        parent_recurring_id: task.parent_recurring_id || null,
        subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
      }));
    } 
    // For individuals and staff, get tasks assigned to them
    else {
      // Build the query
      let query = supabase
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
        .eq('assignee_id', userId);
      
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
      tasksData = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: (task.status || "pending") as TaskStatus,
        priority: (task.priority || "normal") as TaskPriority,
        due_date: task.due_date,
        user_id: task.user_id,
        assignee_id: task.assignee_id || null,
        created_at: task.created_at,
        updated_at: task.updated_at,
        is_recurring_instance: task.is_recurring_instance || false,
        parent_recurring_id: task.parent_recurring_id || null,
        subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
      }));
    }
    
    return tasksData;
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    return [];
  }
}

// For backward compatibility
export const getAssignedTasks = fetchAssignedTasks;
