
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";
import { validateTaskStatus, validateTaskPriority } from "../utils/statusValidator";

/**
 * Fetches tasks assigned to the current user
 */
export async function fetchAssignedTasks(userId: string): Promise<Task[]> {
  console.log(`Fetching assigned tasks for user ${userId}`);
  
  try {
    // Get user email for delegation checks
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    const userEmail = authUser?.user?.email;
    
    let query;
    
    if (userEmail) {
      console.log(`User email found: ${userEmail}, checking delegated_email`);
      
      // Check for tasks where the user is assigned directly OR by email
      query = supabase
        .from('tasks')
        .select('*')
        .or(`assignee_id.eq.${userId},delegated_email.eq.${userEmail}`)
        .order('due_date', { ascending: true });
    } else {
      // Fallback to just checking assignee_id
      query = supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', userId)
        .order('due_date', { ascending: true });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching assigned tasks:", error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} assigned tasks for user ${userId}`);
    
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
      snoozed_until: item.snoozed_until || null,
      delegated_to: item.delegated_to || null,
      delegated_email: item.delegated_email || null,
      is_team_task: item.is_team_task || false
    }));
  } catch (error) {
    console.error("Error in fetchAssignedTasks:", error);
    // Return empty array instead of throwing to prevent UI errors
    return [];
  }
}
