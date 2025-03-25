import React, { createContext, useContext, useState, useEffect } from "react";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { validateTaskStatus, validateTaskPriority } from "@/services/task/utils/statusValidator";

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
        
        let tableExists = true;
        try {
          const { error: tableCheckError } = await supabase
            .from('tasks')
            .select('count')
            .limit(1);
            
          if (tableCheckError) {
            console.log("Tasks table might not exist yet:", tableCheckError);
            tableExists = false;
          }
        } catch (error) {
          console.log("Error checking tasks table:", error);
          tableExists = false;
        }
          
        if (!tableExists) {
          console.log("Using mock task data until table is created");
          const mockTasks = getMockTasks();
          setTasks(mockTasks);
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching tasks:", error);
          throw error;
        }
        
        const typedTasks: Task[] = (data || []).map(task => {
          const taskStatus = validateTaskStatus(task.status || "pending") as TaskStatus;
          const taskPriority = validateTaskPriority(task.priority || "normal") as TaskPriority;
          
          return {
            id: task.id,
            title: task.title,
            description: task.description,
            status: taskStatus,
            priority: taskPriority,
            due_date: task.due_date,
            due_time: task.due_time || null,
            completed_at: task.completed_at || null,
            user_id: task.user_id,
            assignee_id: task.assignee_id || null,
            created_at: task.created_at,
            updated_at: task.updated_at,
            is_recurring_instance: task.is_recurring_instance || false,
            parent_recurring_id: task.parent_recurring_id || null,
            snooze_count: task.snooze_count || 0,
            snoozed_until: task.snoozed_until || null
          };
        });
        
        setTasks(typedTasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        
        const mockTasks = getMockTasks();
        setTasks(mockTasks);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
    
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

  const getMockTasks = (): Task[] => {
    return [
      {
        id: "1",
        title: "Complete project proposal",
        description: "Write up project proposal for client review",
        status: "pending" as TaskStatus,
        priority: "high" as TaskPriority,
        due_date: new Date().toISOString(),
        due_time: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "user-1",
        assignee_id: null,
        completed_at: null,
        is_recurring_instance: false,
        parent_recurring_id: null,
        snooze_count: 0,
        snoozed_until: null
      },
      {
        id: "2",
        title: "Review team updates",
        description: "Check weekly updates from the team and provide feedback",
        status: "in-progress" as TaskStatus,
        priority: "medium" as TaskPriority,
        due_date: new Date(Date.now() + 86400000).toISOString(),
        due_time: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "user-1",
        assignee_id: null,
        completed_at: null,
        is_recurring_instance: false,
        parent_recurring_id: null,
        snooze_count: 0,
        snoozed_until: null
      },
      {
        id: "3",
        title: "Prepare client meeting",
        description: "Create slides and agenda for the upcoming client meeting",
        status: "completed" as TaskStatus,
        priority: "high" as TaskPriority,
        due_date: new Date(Date.now() - 86400000).toISOString(),
        due_time: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "user-1",
        assignee_id: null,
        completed_at: new Date().toISOString(),
        is_recurring_instance: false,
        parent_recurring_id: null,
        snooze_count: 0,
        snoozed_until: null
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
        status: validateTaskStatus(task.status),
        priority: validateTaskPriority(task.priority),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        due_time: task.due_time || null,
        completed_at: task.completed_at || null,
        is_recurring_instance: task.is_recurring_instance || false,
        parent_recurring_id: task.parent_recurring_id || null,
        snooze_count: task.snooze_count || 0,
        snoozed_until: task.snoozed_until || null
      };

      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert(newTask)
          .select('*')
          .single();
          
        if (error) throw error;
        
        const typedTask: Task = {
          id: data.id,
          title: data.title,
          description: data.description,
          status: validateTaskStatus(data.status || "pending") as TaskStatus,
          priority: validateTaskPriority(data.priority || "normal") as TaskPriority,
          due_date: data.due_date,
          due_time: data.due_time || null,
          completed_at: data.completed_at || null,
          user_id: data.user_id,
          assignee_id: data.assignee_id || null,
          created_at: data.created_at,
          updated_at: data.updated_at,
          is_recurring_instance: data.is_recurring_instance || false,
          parent_recurring_id: data.parent_recurring_id || null,
          snooze_count: data.snooze_count || 0,
          snoozed_until: data.snoozed_until || null
        };
        
        setTasks(prev => [typedTask, ...prev]);
        
        toast({
          title: "Task created",
          description: "Your task has been created successfully.",
        });
        
      } catch (error) {
        console.error("Error adding task to Supabase:", error);
        
        const mockTask: Task = {
          ...newTask,
          id: `task-${Date.now()}`,
          status: validateTaskStatus(newTask.status),
          priority: validateTaskPriority(newTask.priority)
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
      const validatedUpdates = {
        ...updates,
        status: updates.status ? validateTaskStatus(updates.status) : undefined,
        priority: updates.priority ? validateTaskPriority(updates.priority) : undefined,
        updated_at: new Date().toISOString()
      };

      try {
        const { error } = await supabase
          .from('tasks')
          .update(validatedUpdates)
          .eq('id', id);
          
        if (error) throw error;
        
        setTasks(prev => 
          prev.map(task => 
            task.id === id ? { ...task, ...validatedUpdates } : task
          )
        );
        
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        });
        
      } catch (error) {
        console.error("Error updating task in Supabase:", error);
        
        setTasks(prev => 
          prev.map(task => 
            task.id === id ? { ...task, ...validatedUpdates } : task
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
        status: "completed" as TaskStatus,
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
