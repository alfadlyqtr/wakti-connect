
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UseTaskOperationsReturn } from './types';
import { createTask as createTaskService } from '@/services/task/createService';
import { delegateTask } from '@/services/task/delegationService';

export const useTaskOperations = (
  userRole: "free" | "individual" | "business" | "staff" | null,
  isStaff: boolean
): UseTaskOperationsReturn => {
  const [isProcessing, setIsProcessing] = useState(false);

  const createTask = async (taskData: any) => {
    setIsProcessing(true);
    try {
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
      
      // Handle team task for business accounts
      if (userRole === "business" && taskData.is_team_task) {
        taskData.is_team_task = true;
      }
      
      // Process task delegation if provided
      if (userRole === "business" && (taskData.delegated_to || taskData.delegated_email)) {
        console.log("Task will be delegated after creation");
      }
      
      const { recurring, ...taskDataWithoutRecurring } = taskData;
      
      const isRecurring = !!recurring && taskData.is_recurring;
      
      console.log("Creating task with data:", taskData);
      
      const createdTask = await createTaskService(
        taskDataWithoutRecurring, 
        isRecurring ? recurring : undefined
      );
      
      // Handle delegation after task creation if needed
      if (userRole === "business" && (taskData.delegated_to || taskData.delegated_email)) {
        await delegateTask(createdTask.id, taskData.delegated_to, taskData.delegated_email);
      }
      
      return createdTask;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Add the delegateTask operation for business accounts
  const delegateTaskOperation = async (taskId: string, userId?: string, email?: string) => {
    setIsProcessing(true);
    try {
      if (userRole !== "business") {
        throw new Error("Only business accounts can delegate tasks");
      }
      
      await delegateTask(taskId, userId, email);
    } catch (error) {
      console.error("Error delegating task:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { 
    createTask,
    delegateTask: delegateTaskOperation
  };
};
