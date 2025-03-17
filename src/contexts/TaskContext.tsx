
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task } from "@/types/task.types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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

  // Fetch tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session, skipping task fetch");
          setIsLoading(false);
          return;
        }
        
        // First check if the tasks table exists
        const { error: tableCheckError } = await supabase
          .from('tasks')
          .select('count')
          .limit(1)
          .catch(error => {
            // If the table doesn't exist yet, we'll return mock data
            console.log("Tasks table might not exist yet:", error);
            return { error: new Error("Tasks table not ready") };
          });
          
        if (tableCheckError) {
          console.log("Using mock task data until table is created");
          // Fall back to mock tasks if table doesn't exist
          const mockTasks = getMockTasks();
          setTasks(mockTasks);
          setIsLoading(false);
          return;
        }
        
        // Fetch real tasks
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching tasks:", error);
          throw error;
        }
        
        setTasks(data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        
        // Fall back to mock tasks
        const mockTasks = getMockTasks();
        setTasks(mockTasks);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
    
    // Set up real-time subscription for tasks
    const subscription = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks'
      }, (payload) => {
        console.log('Real-time task update:', payload);
        fetchTasks();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Utility to get mock tasks for development
  const getMockTasks = (): Task[] => {
    return [
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
  };

  const addTask = async (task: Omit<Task, "id">) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }
      
      const newTask = {
        ...task,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try to add to Supabase first
      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert(newTask)
          .select('*')
          .single();
          
        if (error) throw error;
        
        setTasks(prev => [data, ...prev]);
        toast({
          title: "Task created",
          description: "Your task has been created successfully.",
        });
        
      } catch (error) {
        console.error("Error adding task to Supabase:", error);
        
        // Fall back to client-side-only for development
        const mockTask: Task = {
          ...newTask,
          id: `task-${Date.now()}`
        };
        
        setTasks(prev => [mockTask, ...prev]);
        toast({
          title: "Task created (local only)",
          description: "Your task has been created in local mode.",
        });
      }
      
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

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // Try to update in Supabase first
      try {
        const { error } = await supabase
          .from('tasks')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (error) throw error;
        
        setTasks(prev => 
          prev.map(task => 
            task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
          )
        );
        
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        });
        
      } catch (error) {
        console.error("Error updating task in Supabase:", error);
        
        // Fall back to client-side-only for development
        setTasks(prev => 
          prev.map(task => 
            task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
          )
        );
        
        toast({
          title: "Task updated (local only)",
          description: "Your task has been updated in local mode.",
        });
      }
      
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

  const deleteTask = async (id: string) => {
    try {
      // Try to delete from Supabase first
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setTasks(prev => prev.filter(task => task.id !== id));
        
        toast({
          title: "Task deleted",
          description: "Your task has been deleted successfully.",
        });
        
      } catch (error) {
        console.error("Error deleting task from Supabase:", error);
        
        // Fall back to client-side-only for development
        setTasks(prev => prev.filter(task => task.id !== id));
        
        toast({
          title: "Task deleted (local only)",
          description: "Your task has been deleted in local mode.",
        });
      }
      
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

  const completeTask = async (id: string) => {
    try {
      await updateTask(id, { 
        status: "completed",
        updated_at: new Date().toISOString()
      });
      
      toast({
        title: "Task completed",
        description: "Your task has been marked as completed.",
      });
      
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
