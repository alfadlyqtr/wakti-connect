
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UseTaskOperationsReturn } from './types';
import { createTask as createTaskService } from '@/services/task/createService';
import { delegateTask } from '@/services/task/delegationService';
import { toast } from "@/components/ui/use-toast";

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
      
      // Prepare the task data
      const { recurring, ...taskDataWithoutRecurring } = taskData;
      
      const isRecurring = !!recurring && taskData.isRecurring;
      
      console.log("Creating task with data:", taskData);
      
      // Convert the dueDate to the correct format
      if (taskDataWithoutRecurring.dueDate) {
        taskDataWithoutRecurring.due_date = taskDataWithoutRecurring.dueDate;
        delete taskDataWithoutRecurring.dueDate;
      }
      
      // Convert the dueTime to the correct format
      if (taskDataWithoutRecurring.dueTime) {
        taskDataWithoutRecurring.due_time = taskDataWithoutRecurring.dueTime;
        delete taskDataWithoutRecurring.dueTime;
      }
      
      // Convert subtasks to the correct format
      if (taskDataWithoutRecurring.subtasks && taskDataWithoutRecurring.enableSubtasks) {
        taskDataWithoutRecurring.subtasks = taskDataWithoutRecurring.subtasks.map((subtask: any) => ({
          content: subtask.content,
          is_completed: subtask.isCompleted || false,
          due_date: subtask.dueDate || null,
          due_time: subtask.dueTime || null,
        }));
      } else {
        taskDataWithoutRecurring.subtasks = [];
      }
      
      // Create the task
      const createdTask = await createTaskService(
        taskDataWithoutRecurring, 
        isRecurring ? recurring : undefined
      );
      
      // Handle delegation after task creation if needed
      if (userRole === "business" && (taskData.delegated_to || taskData.delegated_email)) {
        await delegateTask(createdTask.id, taskData.delegated_to, taskData.delegated_email);
      }
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully",
        variant: "success"
      });
      
      return createdTask;
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Task creation failed",
        description: error instanceof Error ? error.message : "Failed to create task",
        variant: "destructive"
      });
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
    delegateTask: delegateTaskOperation,
    isProcessing
  };
};
