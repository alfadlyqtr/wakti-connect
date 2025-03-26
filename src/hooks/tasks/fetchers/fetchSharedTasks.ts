
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';
import { validateTaskStatus, validateTaskPriority } from '@/services/task/utils/statusValidator';

export const fetchSharedTasks = async (userId: string): Promise<TaskWithSharedInfo[]> => {
  try {
    const { data: sharedTasksData, error: sharedError } = await supabase
      .from('shared_tasks')
      .select('id, task_id, shared_with')
      .eq('shared_with', userId);
      
    if (sharedError) throw sharedError;
    
    if (!sharedTasksData || sharedTasksData.length === 0) {
      return [];
    }
    
    const taskIds = sharedTasksData.map(item => item.task_id);
    
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .in('id', taskIds);
      
    if (taskError) throw taskError;
    
    if (!taskData) return [];
    
    // Add the shared_by property and validate types
    const result = taskData.map(task => ({
      ...task,
      status: validateTaskStatus(task.status),
      priority: validateTaskPriority(task.priority),
      shared_by: task.user_id
    })) as TaskWithSharedInfo[];
    
    // Fetch subtasks for these tasks
    return await fetchSubtasksForTasks(result);
  } catch (error) {
    console.error("Error fetching shared tasks:", error);
    return [];
  }
};

// Helper function to fetch subtasks for tasks
async function fetchSubtasksForTasks(tasks: TaskWithSharedInfo[]): Promise<TaskWithSharedInfo[]> {
  if (!tasks || tasks.length === 0) return tasks;
  
  try {
    const taskIds = tasks.map(task => task.id);
    
    const { data: subtasksData, error: subtasksError } = await supabase
      .from('todo_items')
      .select('id, content, is_completed, task_id, due_date, due_time')
      .in('task_id', taskIds);
      
    if (subtasksError) {
      throw subtasksError;
    }
    
    if (!subtasksData) return tasks;
    
    return tasks.map(task => ({
      ...task,
      subtasks: subtasksData.filter(subtask => subtask.task_id === task.id) || []
    }));
  } catch (error) {
    console.error("Error in fetchSubtasksForTasks:", error);
    return tasks;
  }
}
