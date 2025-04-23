
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UseTaskOperationsReturn } from './types';
import { createTask as createTaskService } from '@/services/task/createService';
import { toast } from "@/components/ui/use-toast";

export const useTaskOperations = (
  userRole: "free" | "individual" | "business" | "staff" | "super-admin" | null,
  isStaff: boolean = false
): UseTaskOperationsReturn => {
  const [isProcessing, setIsProcessing] = useState(false);

  const createTask = async (taskData: any) => {
    setIsProcessing(true);
    try {
      console.log("Starting task creation with data:", taskData);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No active session found");
        throw new Error("You must be logged in to create a task");
      }
      
      if (isStaff) {
        console.error("Staff member attempted to create a task");
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
          
        if (countError) {
          console.error("Error checking task limits:", countError);
          throw countError;
        }
        
        if (existingTasks && existingTasks.length >= 1) {
          console.error("Free account monthly task limit reached");
          throw new Error("Free accounts can only create one task per month. Upgrade to create more tasks.");
        }
      }
      
      // Prepare the task data
      const { recurring, ...taskDataWithoutRecurring } = taskData;
      
      const isRecurring = !!recurring && taskData.isRecurring;
      
      console.log("Processing task data:", { 
        role: userRole, 
        isRecurring
      });
      
      // Fields already have the correct names, no need to transform them
      let formattedTaskData = { ...taskDataWithoutRecurring };
      
      // Format subtasks if they exist
      if (formattedTaskData.subtasks && formattedTaskData.enableSubtasks) {
        formattedTaskData.subtasks = formattedTaskData.subtasks.map((subtask: any) => ({
          content: subtask.content,
          is_completed: subtask.isCompleted || false,
          due_date: subtask.due_date || null,
          due_time: subtask.due_time || null,
        }));
        console.log("Formatted subtasks:", formattedTaskData.subtasks);
      } else {
        formattedTaskData.subtasks = [];
      }
      
      console.log("Final task data before creation:", formattedTaskData);
      
      // Create the task
      const createdTask = await createTaskService(
        formattedTaskData, 
        isRecurring ? recurring : undefined
      );
      
      console.log("Task created successfully:", createdTask);
      
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

  return { 
    createTask,
    isProcessing
  };
};
