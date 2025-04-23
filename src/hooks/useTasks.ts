
import { useState, useCallback } from 'react';
import { TaskFormData, Task } from "@/types/task.types";
import { useTaskOperations } from './tasks/useTaskOperations';
import { useUserRole } from './useUserRole';

export const useTasks = () => {
  const { userRole } = useUserRole();
  const { createTask } = useTaskOperations(userRole);
  
  const handleCreateTask = useCallback(async (taskData: TaskFormData): Promise<Task | null> => {
    try {
      const newTask = await createTask(taskData);
      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      return null;
    }
  }, [createTask]);
  
  return {
    handleCreateTask
  };
};
