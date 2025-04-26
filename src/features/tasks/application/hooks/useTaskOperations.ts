
import { useState } from 'react';
import { taskService } from "../../domain/services/taskService";
import { Task, TaskFormData } from "../../domain/types";
import { useToast } from "@/components/ui/use-toast";

export const useTaskOperations = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const createTask = async (taskData: TaskFormData): Promise<Task> => {
    setIsProcessing(true);
    try {
      const task = await taskService.createTask(taskData);
      
      if (!task) {
        throw new Error("Failed to create task");
      }
      
      toast({
        title: "Task Created",
        description: "Your task was created successfully"
      });
      
      return task;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const updateTask = async (taskId: string, taskData: Partial<TaskFormData>): Promise<Task> => {
    setIsProcessing(true);
    try {
      const task = await taskService.updateTask(taskId, taskData);
      
      if (!task) {
        throw new Error("Failed to update task");
      }
      
      toast({
        title: "Task Updated",
        description: "Your task was updated successfully"
      });
      
      return task;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const deleteTask = async (taskId: string): Promise<void> => {
    setIsProcessing(true);
    try {
      const success = await taskService.deleteTask(taskId);
      
      if (!success) {
        throw new Error("Failed to delete task");
      }
      
      toast({
        title: "Task Deleted",
        description: "Your task was deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const completeTask = async (taskId: string): Promise<Task> => {
    setIsProcessing(true);
    try {
      const task = await taskService.completeTask(taskId);
      
      if (!task) {
        throw new Error("Failed to complete task");
      }
      
      toast({
        title: "Task Completed",
        description: "Your task was marked as complete"
      });
      
      return task;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete task",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    isProcessing
  };
};
