
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";
import { validateTaskStatus, validateTaskPriority } from "../utils/statusValidator";

/**
 * Fetches team tasks created by a business
 * These are tasks marked with is_team_task=true
 */
export async function fetchTeamTasks(businessId: string): Promise<Task[]> {
  console.log(`Fetching team tasks for business ${businessId}`);
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', businessId)
      .eq('is_team_task', true)
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error("Error fetching team tasks:", error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} team tasks for business ${businessId}`);
    
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
    console.error("Error in fetchTeamTasks:", error);
    // Return empty array instead of throwing to prevent UI errors
    return [];
  }
}
