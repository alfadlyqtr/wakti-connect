
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";
import { validateTaskStatus, validateTaskPriority } from "@/services/task/utils/statusValidator";

// Convert database task to typed Task object
export const mapDbTaskToTyped = (task: any): Task => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: validateTaskStatus(task.status || "pending") as TaskStatus,
    priority: validateTaskPriority(task.priority || "normal") as TaskPriority,
    due_date: task.due_date,
    due_time: task.due_time || null,
    completed_at: task.completed_at || null,
    user_id: task.user_id,
    created_at: task.created_at,
    updated_at: task.updated_at,
    is_recurring_instance: task.is_recurring_instance || false,
    parent_recurring_id: task.parent_recurring_id || null,
    snooze_count: task.snooze_count || 0,
    snoozed_until: task.snoozed_until || null
  };
};

// Check if tasks table exists
export const checkTasksTableExists = async (): Promise<boolean> => {
  try {
    const { error: tableCheckError } = await supabase
      .from('tasks')
      .select('count')
      .limit(1);
      
    if (tableCheckError) {
      console.log("Tasks table might not exist yet:", tableCheckError);
      return false;
    }
    return true;
  } catch (error) {
    console.log("Error checking tasks table:", error);
    return false;
  }
};
