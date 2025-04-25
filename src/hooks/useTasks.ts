import { useState, useCallback } from 'react';
import { TaskFormData, Task } from "@/types/task.types";
import { useTaskOperations } from './tasks/useTaskOperations';
import { useUserRole } from "@/features/auth/hooks/useUserRole";

export const useTasks = () => {
  const { userRole } = useUserRole();
  
  // Map super-admin to business role for task operations
  const effectiveRole = userRole === "super-admin" ? "business" : userRole;
  
  // Make sure we pass a valid role or default to 'free'
  const sanitizedRole = (effectiveRole && ['individual', 'business', 'staff', 'free'].includes(effectiveRole)) 
    ? effectiveRole as 'individual' | 'business' | 'staff' | 'free'
    : 'free';
  
  const { createTask } = useTaskOperations(sanitizedRole);
  
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
