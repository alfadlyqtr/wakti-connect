
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority } from '@/types/task.types';
import { toast } from "@/components/ui/use-toast";

interface UseTasksPageStateReturn {
  tasks: Task[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  filterPriority: string | null;
  setFilterPriority: (priority: string | null) => void;
  userRole: "free" | "individual" | "business" | "staff" | null;
  createTaskDialogOpen: boolean;
  setCreateTaskDialogOpen: (open: boolean) => void;
  handleCreateTask: (taskData: any) => Promise<void>;
  refetchTasks: () => Promise<void>;
  filteredTasks: Task[];
  isPaidAccount: boolean;
}

export const useTasksPageState = (): UseTasksPageStateReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | "staff" | null>(null);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);

  // Determine if user has a paid account
  const isPaidAccount = userRole === "individual" || userRole === "business";

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setUserRole("free");
          return;
        }
        
        const { data } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();
          
        setUserRole(data?.account_type || "free");
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("free");
      }
    };
    
    fetchUserRole();
  }, []);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setTasks([]);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*, subtasks:todo_items(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert data to properly typed Task objects
      const typedTasks: Task[] = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        due_date: task.due_date,
        due_time: task.due_time,
        user_id: task.user_id,
        created_at: task.created_at,
        updated_at: task.updated_at,
        completed_at: task.completed_at,
        is_recurring: task.is_recurring,
        is_recurring_instance: task.is_recurring_instance,
        parent_recurring_id: task.parent_recurring_id,
        snooze_count: task.snooze_count,
        snoozed_until: task.snoozed_until,
        subtasks: task.subtasks || []
      }));
      
      setTasks(typedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Failed to load tasks",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle creating a new task
  const handleCreateTask = async (taskData: any) => {
    try {
      // Check if free user has reached their task limit
      if (userRole === "free") {
        const { count, error } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', taskData.user_id);
          
        if (error) throw error;
        
        if (count && count >= 1) {
          toast({
            title: "Task limit reached",
            description: "Free accounts are limited to 1 task. Please upgrade to create more tasks.",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Create the task
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to create tasks");
      }
      
      const taskToCreate = {
        ...taskData,
        user_id: session.user.id
      };
      
      console.log("Creating task with data:", taskToCreate);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskToCreate)
        .select()
        .single();
        
      if (error) throw error;
      
      // Create subtasks if any
      if (taskData.subtasks && taskData.subtasks.length > 0) {
        const subtasksToInsert = taskData.subtasks.map((subtask: any) => ({
          task_id: data.id,
          content: subtask.content,
          is_completed: false
        }));
        
        const { error: subtaskError } = await supabase
          .from('todo_items')
          .insert(subtasksToInsert);
          
        if (subtaskError) throw subtaskError;
      }
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully",
        variant: "success"
      });
      
      setCreateTaskDialogOpen(false);
      fetchTasks(); // Refresh tasks list
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Failed to create task",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery ? 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) : 
      true;
      
    const matchesStatus = filterStatus ? task.status === filterStatus : true;
    const matchesPriority = filterPriority ? task.priority === filterPriority : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return {
    tasks,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    userRole,
    createTaskDialogOpen,
    setCreateTaskDialogOpen,
    handleCreateTask,
    refetchTasks: fetchTasks,
    filteredTasks,
    isPaidAccount
  };
};
