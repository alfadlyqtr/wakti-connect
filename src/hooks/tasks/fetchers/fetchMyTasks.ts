
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';

export const fetchMyTasks = async (userId: string): Promise<TaskWithSharedInfo[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching my tasks:", error);
    return [];
  }
};
