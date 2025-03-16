
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";

// Fetch tasks for calendar
export const fetchTasks = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('id, title, due_date')
      .eq('user_id', userId)
      .not('due_date', 'is', null);
    
    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      return [];
    }
    
    if (!tasksData || tasksData.length === 0) {
      return [];
    }
    
    return tasksData.map(task => ({
      id: task.id,
      title: task.title,
      date: new Date(task.due_date as string),
      type: 'task' as const
    }));
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    return [];
  }
};
