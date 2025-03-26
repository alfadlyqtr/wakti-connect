
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';

export const fetchDefaultTasks = async (userId: string): Promise<TaskWithSharedInfo[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching default tasks:", error);
    return [];
  }
};
