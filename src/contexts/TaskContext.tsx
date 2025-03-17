
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task } from "@/types/task.types";

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock task data
        const mockTasks: Task[] = [
          {
            id: "1",
            title: "Complete project proposal",
            description: "Write up project proposal for client review",
            status: "pending",
            priority: "high",
            due_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: "user-1",
            assignee_id: null
          },
          {
            id: "2",
            title: "Review team updates",
            description: "Check weekly updates from the team and provide feedback",
            status: "in-progress",
            priority: "medium",
            due_date: new Date(Date.now() + 86400000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: "user-1",
            assignee_id: null
          },
          {
            id: "3",
            title: "Prepare client meeting",
            description: "Create slides and agenda for the upcoming client meeting",
            status: "completed",
            priority: "high",
            due_date: new Date(Date.now() - 86400000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: "user-1",
            assignee_id: null
          }
        ];
        
        setTasks(mockTasks);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  const addTask = async (task: Omit<Task, "id">) => {
    try {
      // Simulate API call
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add task'));
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update task'));
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete task'));
    }
  };

  const completeTask = async (id: string) => {
    try {
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, status: "completed" } : task
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to complete task'));
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        addTask,
        updateTask,
        deleteTask,
        completeTask
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
