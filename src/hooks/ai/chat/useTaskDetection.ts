
import { useState } from 'react';
import { AITaskDetectionResult, Task } from './types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

export const useTaskDetection = (userId?: string) => {
  const [detectedTask, setDetectedTask] = useState<AITaskDetectionResult | null>(null);
  const [pendingTaskConfirmation, setPendingTaskConfirmation] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const confirmCreateTask = async (): Promise<Task | null> => {
    if (!detectedTask) return null;
    
    try {
      setIsCreatingTask(true);
      
      // API call to create the task would go here
      
      // For now, just simulate a successful creation
      const newTask: Task = {
        id: uuidv4(),
        title: detectedTask.title,
        description: detectedTask.description || '',
        status: 'pending',
        priority: detectedTask.priority || 'normal',
        dueDate: detectedTask.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: detectedTask.category || 'daily',
        userId: userId || '',
        completedAt: null,
      };
      
      // Reset task states
      setDetectedTask(null);
      setPendingTaskConfirmation(false);
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsCreatingTask(false);
    }
  };

  const cancelCreateTask = () => {
    // Reset task states
    setDetectedTask(null);
    setPendingTaskConfirmation(false);
  };

  return {
    detectedTask,
    setDetectedTask,
    pendingTaskConfirmation,
    setPendingTaskConfirmation,
    isCreatingTask,
    confirmCreateTask,
    cancelCreateTask,
  };
};
