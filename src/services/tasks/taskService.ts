
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData, TaskStatus } from "@/types/task.types";

export const fetchUserTasks = async (userId?: string): Promise<Task[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
      
    if (!session) {
      return [];
    }
    
    const user_id = userId || session.user.id;
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*, subtasks:todo_items(*)')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
        
    if (error) throw error;
    
    // Cast the status to TaskStatus type to satisfy TypeScript
    return (data || []).map(task => ({
      ...task,
      status: task.status as TaskStatus,
      priority: task.priority as any,
      subtasks: task.subtasks || []
    })) as Task[];
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return [];
  }
};

export const searchTasks = async (query: string): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .ilike('title', `%${query}%`);

    if (error) {
      console.error('Error searching tasks:', error);
      return [];
    }

    // Cast the status to TaskStatus type
    return (data || []).map(task => ({
      ...task,
      status: task.status as TaskStatus,
      priority: task.priority as any
    })) as Task[];
  } catch (error) {
    console.error('Error in searchTasks:', error);
    return [];
  }
};

export const createTask = async (taskData: TaskFormData): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      status: data.status as TaskStatus,
      priority: data.priority as any
    } as Task;
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};
