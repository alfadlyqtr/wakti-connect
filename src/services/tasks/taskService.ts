
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData } from "@/types/task.types";

export const fetchUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
      
    if (!session) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*, subtasks:todo_items(*)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
        
    if (error) throw error;
    
    return data || [];
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return [];
  }
};

export const searchTasks = async (query: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .ilike('title', `%${query}%`);

  if (error) {
    console.error('Error searching tasks:', error);
    return [];
  }

  return data || [];
};
