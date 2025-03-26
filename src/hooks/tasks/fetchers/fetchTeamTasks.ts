
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';
import { validateTaskStatus, validateTaskPriority } from '@/services/task/utils/statusValidator';

export const fetchTeamTasks = async (businessId: string): Promise<TaskWithSharedInfo[]> => {
  try {
    console.log(`Fetching team tasks for business ${businessId}`);
    
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
    
    // Apply proper type validations
    const typedTasks: TaskWithSharedInfo[] = (data || []).map(task => ({
      ...task,
      status: validateTaskStatus(task.status),
      priority: validateTaskPriority(task.priority)
    }));
    
    return typedTasks;
  } catch (error) {
    console.error("Error in fetchTeamTasks:", error);
    return [];
  }
};
