
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Task } from "../types";

/**
 * Get task by ID for viewing details
 */
export async function getTaskById(taskId: string): Promise<Task | null> {
  try {
    console.log("getTaskById: Fetching task by ID:", taskId);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error("getTaskById: No active session found");
      throw new Error("Authentication required");
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks:todo_items(*)
      `)
      .eq('id', taskId)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no data
      
    if (error) {
      console.error("getTaskById: Supabase error fetching task:", error);
      throw error;
    }
    
    if (!data) {
      console.log("getTaskById: No task found with ID:", taskId);
      return null;
    }
    
    console.log("getTaskById: Task data retrieved:", data);
    return {
      ...data,
      subtasks: Array.isArray(data.subtasks) ? data.subtasks : []
    } as Task;
  } catch (error: any) {
    console.error("getTaskById: Error fetching task:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to fetch task details",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Get upcoming tasks for dashboard
 */
export async function getUpcomingTasks(): Promise<Task[]> {
  try {
    console.log("getUpcomingTasks: Fetching upcoming tasks");
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.warn("getUpcomingTasks: No active session found");
      return [];
    }
    
    // Get tasks due in the next 7 days
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    console.log("getUpcomingTasks: Date range for upcoming tasks:", {
      today: today.toISOString(),
      nextWeek: nextWeek.toISOString()
    });
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks:todo_items(*)
      `)
      .eq('user_id', session.user.id)
      .lte('due_date', nextWeek.toISOString())
      .gte('due_date', today.toISOString())
      .neq('status', 'completed')
      .order('due_date', { ascending: true });
      
    if (error) {
      // Check if the error is because the table doesn't exist yet
      if (error.code === 'PGRST116') {
        console.log("getUpcomingTasks: Tasks table might not exist yet");
        return [];
      }
      
      console.error("getUpcomingTasks: Supabase error fetching upcoming tasks:", error);
      throw error;
    }
    
    console.log(`getUpcomingTasks: Retrieved ${data?.length || 0} upcoming tasks`);
    
    // Transform data with proper typing and ensure subtasks is always an array
    return (data || []).map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      user_id: task.user_id,
      assignee_id: task.assignee_id || null,
      created_at: task.created_at,
      updated_at: task.updated_at,
      is_recurring_instance: task.is_recurring_instance || false,
      parent_recurring_id: task.parent_recurring_id || null,
      subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
    }));
    
  } catch (error: any) {
    console.error("getUpcomingTasks: Error fetching upcoming tasks:", error);
    return [];
  }
}
