
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';
import { validateTaskStatus, validateTaskPriority } from '@/services/task/utils/statusValidator';
import { fetchSubtasksForTasks } from './fetchSubtasks';

export const fetchTeamTasks = async (businessId: string): Promise<TaskWithSharedInfo[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', businessId)
      .eq('is_team_task', true);
      
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
    console.error("Error fetching team tasks:", error);
    return [];
  }
};
