
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';

export const fetchSubtasksForTasks = async (tasks: any[]): Promise<TaskWithSharedInfo[]> => {
  if (!tasks || tasks.length === 0) return tasks;
  
  try {
    const taskIds = tasks.map(task => task.id);
    
    const { data: subtasksData, error: subtasksError } = await supabase
      .from('todo_items')
      .select('*')
      .in('task_id', taskIds);
      
    if (subtasksError) throw subtasksError;
    
    console.log(`Fetched ${subtasksData?.length || 0} subtasks for ${taskIds.length} tasks`);
    
    return tasks.map(task => ({
      ...task,
      subtasks: subtasksData?.filter(subtask => subtask.task_id === task.id) || []
    }));
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    return tasks;
  }
};
