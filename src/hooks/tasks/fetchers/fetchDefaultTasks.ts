
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';
import { validateTaskStatus, validateTaskPriority } from '@/services/task/utils/statusValidator';

export const fetchDefaultTasks = async (userId: string): Promise<TaskWithSharedInfo[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Apply proper type validations
    const typedTasks: TaskWithSharedInfo[] = (data || []).map(task => ({
      ...task,
      status: validateTaskStatus(task.status),
      priority: validateTaskPriority(task.priority)
    }));
    
    return typedTasks;
  } catch (error) {
    console.error("Error fetching default tasks:", error);
    return [];
  }
};
