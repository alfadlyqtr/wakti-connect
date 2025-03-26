
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';

// Helper function to fetch subtasks for tasks
export async function fetchSubtasksForTasks(tasks: TaskWithSharedInfo[]): Promise<TaskWithSharedInfo[]> {
  if (!tasks || tasks.length === 0) return tasks;
  
  try {
    const taskIds = tasks.map(task => task.id);
    
    console.log("Fetching subtasks for task IDs:", taskIds);
    
    const { data: subtasksData, error: subtasksError } = await supabase
      .from('todo_items')
      .select('id, content, is_completed, task_id, due_date, due_time')
      .in('task_id', taskIds);
      
    if (subtasksError) {
      console.error("Error fetching subtasks:", subtasksError);
      throw subtasksError;
    }
    
    console.log(`Fetched ${subtasksData?.length || 0} subtasks for ${taskIds.length} tasks`);
    
    if (subtasksData) {
      console.log("Sample subtask data:", subtasksData.length > 0 ? subtasksData[0] : "No subtasks found");
    }
    
    return tasks.map(task => ({
      ...task,
      subtasks: subtasksData?.filter(subtask => subtask.task_id === task.id) || []
    }));
  } catch (error) {
    console.error("Error in fetchSubtasksForTasks:", error);
    return tasks;
  }
}
