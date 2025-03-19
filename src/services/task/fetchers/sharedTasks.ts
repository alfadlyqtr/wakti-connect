
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";

/**
 * Fetches tasks shared with the current user
 */
export async function fetchSharedTasks(
  userId: string,
  filterStatus: string = "all", 
  filterPriority: string = "all", 
  searchQuery: string = ""
): Promise<Task[]> {
  try {
    // Build the base query
    let query = supabase
      .from('shared_tasks')
      .select(`
        task_id, 
        tasks(
          *,
          subtasks:todo_items(*)
        )
      `)
      .eq('shared_with', userId);
    
    // Execute the query
    const { data, error } = await query.order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Extract just the tasks objects from the response
    let tasksData: Task[] = [];
    if (data && data.length > 0) {
      for (const item of data) {
        if (item.tasks) {
          const task = item.tasks;
          tasksData.push({
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
          });
        }
      }
    }
    
    // Apply client-side filters (status, priority, search)
    tasksData = tasksData.filter(task => {
      // Status filter
      const matchesStatus = filterStatus === "all" ? true : task.status === filterStatus;
      
      // Priority filter
      const matchesPriority = filterPriority === "all" ? true : task.priority === filterPriority;
      
      // Search filter
      const matchesSearch = searchQuery 
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      return matchesStatus && matchesPriority && matchesSearch;
    });
    
    return tasksData;
  } catch (error) {
    console.error("Error fetching shared tasks:", error);
    return [];
  }
}

// For backward compatibility
export const getSharedTasks = fetchSharedTasks;
