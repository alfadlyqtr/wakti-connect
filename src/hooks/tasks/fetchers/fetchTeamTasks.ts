
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';
import { validateTaskStatus, validateTaskPriority } from '@/services/task/utils/statusValidator';
import { fetchSubtasksForTasks } from './fetchSubtasks';
import { Task, TaskStatus, TaskPriority } from '@/types/task.types';

export const fetchTeamTasks = async (businessId: string): Promise<TaskWithSharedInfo[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', businessId)
      .eq('is_team_task', true);
      
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    // Use type assertion to avoid deep type inference
    const rawTasks = data as any[];
    
    // Map to intermediate objects with simple type
    const processedTasks = rawTasks.map(rawTask => ({
      ...rawTask,
      status: validateTaskStatus(rawTask.status),
      priority: validateTaskPriority(rawTask.priority)
    }));
    
    // Explicit cast to the target type
    const typedTasks = processedTasks as TaskWithSharedInfo[];
    
    return await fetchSubtasksForTasks(typedTasks);
  } catch (error) {
    console.error("Error fetching team tasks:", error);
    return [];
  }
};
