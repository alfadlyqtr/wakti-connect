
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task } from "@/types/task.types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { TaskContextType } from "./task/taskContextTypes";
import { fetchTasks, addTask, updateTask, deleteTask, completeTask } from "./task/taskOperations";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        // Pass false to explicitly exclude archived tasks
        const loadedTasks = await fetchTasks(false);
        setTasks(loadedTasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks'
      }, (payload) => {
        console.log('Real-time task update:', payload);
        loadTasks();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAddTask = async (task: Omit<Task, "id">) => {
    try {
      const newTask = await addTask(task);
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      console.error("Task creation failed:", err);
      setError(err instanceof Error ? err : new Error('Failed to add task'));
      toast({
        title: "Task creation failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await updateTask(id, updates);
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      );
    } catch (err) {
      console.error("Task update failed:", err);
      setError(err instanceof Error ? err : new Error('Failed to update task'));
      toast({
        title: "Task update failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error("Task deletion failed:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete task'));
      toast({
        title: "Task deletion failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      await completeTask(id);
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, status: "completed", completed_at: new Date().toISOString() } : task
        )
      );
    } catch (err) {
      console.error("Failed to complete task:", err);
      setError(err instanceof Error ? err : new Error('Failed to complete task'));
      toast({
        title: "Failed to complete task",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        addTask: handleAddTask,
        updateTask: handleUpdateTask,
        deleteTask: handleDeleteTask,
        completeTask: handleCompleteTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
