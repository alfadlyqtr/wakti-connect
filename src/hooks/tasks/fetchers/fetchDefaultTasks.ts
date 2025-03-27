
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority, ArchiveReason } from "@/types/task.types";
import { TaskWithSharedInfo } from "../types";

export async function fetchDefaultTasks(userId: string): Promise<TaskWithSharedInfo[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subtasks:todo_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Convert string status and priority to their proper types
  const typedTasks = (data || []).map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority,
    due_date: task.due_date,
    due_time: task.due_time || null,
    user_id: task.user_id,
    created_at: task.created_at,
    updated_at: task.updated_at,
    completed_at: task.completed_at || null,
    is_recurring_instance: task.is_recurring_instance || false,
    parent_recurring_id: task.parent_recurring_id || null,
    snooze_count: task.snooze_count || 0,
    snoozed_until: task.snoozed_until || null,
    subtasks: task.subtasks || [],
    archived_at: task.archived_at || null,
    archive_reason: task.archive_reason as ArchiveReason || null
  }));
  
  return typedTasks;
}
