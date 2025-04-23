
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskFormData, TaskStatus, TaskPriority } from '@/types/task.types';
import { toast } from "@/components/ui/use-toast";
import { UseTaskOperationsReturn } from './types';

export function useTaskOperations(
  userRole: "free" | "individual" | "business" | "staff" | null
): UseTaskOperationsReturn {
  const [isProcessing, setIsProcessing] = useState(false);

  // Create a new task
  const createTask = async (taskData: TaskFormData): Promise<Task> => {
    setIsProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to create a task");
      }
      
      // For free users, check if they already have a task
      if (userRole === "free") {
        const { data: existingTasks, error: countError } = await supabase
          .from('tasks')
          .select('id', { count: 'exact' })
          .eq('user_id', session.user.id);
          
        if (countError) throw countError;
        
        if (existingTasks && existingTasks.length >= 1) {
          throw new Error("Free accounts can only create one task. Upgrade to create more tasks.");
        }
      }
      
      // Insert the new task
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: taskData.due_date,
          due_time: taskData.due_time,
          user_id: session.user.id,
          status: 'pending' as TaskStatus
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Cast data to the Task type with appropriate type assertions
      const task: Task = {
        ...data,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority
      };
      
      // Insert subtasks if any
      if (taskData.subtasks && taskData.subtasks.length > 0) {
        const subtasksToInsert = taskData.subtasks.map(subtask => ({
          task_id: task.id,
          content: subtask.content,
          is_completed: subtask.is_completed || false,
          due_date: subtask.due_date,
          due_time: subtask.due_time
        }));
        
        const { error: subtaskError } = await supabase
          .from('todo_items')
          .insert(subtasksToInsert);
        
        if (subtaskError) {
          console.error("Error creating subtasks:", subtaskError);
          // We'll continue even if subtasks fail
        }
      }
      
      return task;
    } catch (error) {
      console.error("Error in createTask:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Update an existing task
  const updateTask = async (taskId: string, taskData: Partial<TaskFormData>): Promise<Task> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: taskData.due_date,
          due_time: taskData.due_time,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;

      // Cast to Task with proper types
      const task: Task = {
        ...data,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority
      };
      
      // Handle subtasks if provided
      if (taskData.subtasks) {
        // First, fetch existing subtasks
        const { data: existingSubtasks } = await supabase
          .from('todo_items')
          .select('id')
          .eq('task_id', taskId);
        
        // Delete all existing subtasks
        if (existingSubtasks && existingSubtasks.length > 0) {
          await supabase
            .from('todo_items')
            .delete()
            .eq('task_id', taskId);
        }
        
        // Insert new subtasks
        if (taskData.subtasks.length > 0) {
          const subtasksToInsert = taskData.subtasks.map(subtask => ({
            task_id: taskId,
            content: subtask.content,
            is_completed: subtask.is_completed || false,
            due_date: subtask.due_date,
            due_time: subtask.due_time
          }));
          
          await supabase
            .from('todo_items')
            .insert(subtasksToInsert);
        }
      }
      
      return task;
    } catch (error) {
      console.error("Error in updateTask:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string): Promise<void> => {
    setIsProcessing(true);
    try {
      // Delete all subtasks first
      await supabase
        .from('todo_items')
        .delete()
        .eq('task_id', taskId);
      
      // Then delete the task
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error in deleteTask:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete a task
  const completeTask = async (taskId: string): Promise<Task> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          status: 'completed' as TaskStatus,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Cast to Task with proper types
      const task: Task = {
        ...data,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority
      };
      
      return task;
    } catch (error) {
      console.error("Error in completeTask:", error);
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
}
