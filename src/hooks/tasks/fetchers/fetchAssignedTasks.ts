
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';
import { validateTaskStatus, validateTaskPriority } from '@/services/task/utils/statusValidator';
import { fetchSubtasksForTasks } from './fetchSubtasks';

export const fetchAssignedTasks = async (userId: string, isBusinessAccount = false): Promise<TaskWithSharedInfo[]> => {
  try {
    let query;
    
    if (isBusinessAccount) {
      // Business account - get tasks created by the business
      query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
    } else {
      // Regular user or staff - get tasks assigned to them
      query = supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (!data) return [];
    
    // Transform task data to ensure correct types
    const typedTasks: TaskWithSharedInfo[] = data.map(task => ({
      ...task,
      status: validateTaskStatus(task.status),
      priority: validateTaskPriority(task.priority)
    })) as TaskWithSharedInfo[];
    
    return await fetchSubtasksForTasks(typedTasks);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    return [];
  }
};
