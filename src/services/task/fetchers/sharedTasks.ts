
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";
import { validateTaskStatus, validateTaskPriority } from "../utils/statusValidator";

/**
 * Fetches tasks shared with the current user
 */
export async function fetchSharedTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('shared_tasks')
    .select('task_id, tasks(*)')
    .eq('shared_with', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Extract just the tasks objects from the response
  const tasksData: Task[] = [];
  if (data && data.length > 0) {
    for (const item of data) {
      if (item.tasks) {
        const task = item.tasks;
        tasksData.push({
          id: task.id,
          title: task.title,
          description: task.description,
          status: validateTaskStatus(task.status || "pending") as TaskStatus,
          priority: validateTaskPriority(task.priority || "normal") as TaskPriority,
          due_date: task.due_date,
          // Handle potentially missing properties
          due_time: task.due_time || null,
          user_id: task.user_id,
          assignee_id: task.assignee_id || null,
          created_at: task.created_at,
          updated_at: task.updated_at,
          completed_at: task.completed_at || null,
          is_recurring_instance: task.is_recurring_instance || false,
          parent_recurring_id: task.parent_recurring_id || null,
          snooze_count: task.snooze_count || 0,
          snoozed_until: task.snoozed_until || null
        });
      }
    }
  }
  return tasksData;
}
