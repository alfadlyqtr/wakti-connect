
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';

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
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchTeamTasks:", error);
    return [];
  }
};
