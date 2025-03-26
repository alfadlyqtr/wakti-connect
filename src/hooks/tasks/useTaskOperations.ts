
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createTask as createTaskService } from '@/services/task/createService';
import { UseTaskOperationsReturn } from './types';

export const useTaskOperations = (userRole: "free" | "individual" | "business" | "staff" | null, isStaff: boolean): UseTaskOperationsReturn => {
  const queryClient = useQueryClient();

  const createTask = async (taskData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) throw new Error("You must be logged in to create a task");
    
    if (isStaff) {
      throw new Error("Staff members cannot create tasks");
    }
    
    if (userRole === "free") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data: existingTasks, error: countError } = await supabase
        .from('tasks')
        .select('id')
        .eq('user_id', session.user.id)
        .gte('created_at', startOfMonth.toISOString());
        
      if (countError) throw countError;
      
      if (existingTasks && existingTasks.length >= 1) {
        throw new Error("Free accounts can only create one task per month. Upgrade to create more tasks.");
      }
    }
    
    const { recurring, ...taskDataWithoutRecurring } = taskData;
    
    const isRecurring = !!recurring && taskData.is_recurring;
    
    try {
      console.log("Creating task with data:", taskData);
      
      const createdTask = await createTaskService(
        taskDataWithoutRecurring, 
        isRecurring ? recurring : undefined
      );
      
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      return createdTask;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };

  return {
    createTask
  };
};
