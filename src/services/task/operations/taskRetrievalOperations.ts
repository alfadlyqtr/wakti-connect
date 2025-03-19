
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Task } from "../types";

/**
 * Get task by ID for viewing details
 */
export async function getTaskById(taskId: string): Promise<Task | null> {
  try {
    console.log("Fetching task by ID:", taskId);
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks:todo_items(*)
      `)
      .eq('id', taskId)
      .single();
      
    if (error) {
      console.error("Supabase error fetching task:", error);
      throw error;
    }
    
    console.log("Task data retrieved:", data);
    return {
      ...data,
      subtasks: Array.isArray(data.subtasks) ? data.subtasks : []
    } as Task;
  } catch (error: any) {
    console.error("Error fetching task:", error);
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
    console.log("Fetching upcoming tasks");
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.warn("No active session found when fetching upcoming tasks");
      return [];
    }
    
    // Get tasks due in the next 7 days
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    console.log("Date range for upcoming tasks:", {
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
      console.error("Supabase error fetching upcoming tasks:", error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} upcoming tasks`);
    
    // Transform data with proper typing and ensure subtasks is always an array
    return (data || []).map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as Task["status"],
      priority: task.priority as Task["priority"],
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
    console.error("Error fetching upcoming tasks:", error);
    // Don't show toast for this one as it's used in the background
    return [];
  }
}
