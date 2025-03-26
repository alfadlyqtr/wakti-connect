
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';

export const fetchSharedTasks = async (userId: string): Promise<TaskWithSharedInfo[]> => {
  try {
    const { data: sharedTasksData, error: sharedError } = await supabase
      .from('shared_tasks')
      .select('task_id, tasks(*)')
      .eq('shared_with', userId);
      
    if (sharedError) throw sharedError;
    
    if (sharedTasksData && sharedTasksData.length > 0) {
      const taskData = sharedTasksData
        .filter(item => item.tasks)
        .map(item => ({
          ...item.tasks,
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
