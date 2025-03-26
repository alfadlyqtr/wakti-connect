
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';
import { validateTaskStatus, validateTaskPriority } from '@/services/task/utils/statusValidator';

export const fetchSharedTasks = async (userId: string): Promise<TaskWithSharedInfo[]> => {
  try {
    const { data: sharedTasksData, error: sharedError } = await supabase
      .from('shared_tasks')
      .select('task_id, tasks(*)')
      .eq('shared_with', userId);
      
    if (sharedError) throw sharedError;
    
    if (sharedTasksData && sharedTasksData.length > 0) {
      const taskData: TaskWithSharedInfo[] = sharedTasksData
        .filter(item => item.tasks)
        .map(item => ({
          ...item.tasks,
          status: validateTaskStatus(item.tasks.status),
          priority: validateTaskPriority(item.tasks.priority),
          shared_with: [userId]
        }));
      
      return taskData;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching shared tasks:", error);
    return [];
  }
};
