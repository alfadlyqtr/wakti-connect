import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority, TaskTab } from '@/types/task.types';
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
  editTaskDialogOpen: boolean;
  setEditTaskDialogOpen: (open: boolean) => void;
  currentEditTask: Task | null;
  setCurrentEditTask: (task: Task | null) => void;
  handleCreateTask: (taskData: any) => Promise<void>;
  handleUpdateTask: (taskId: string, taskData: any) => Promise<void>;
  handleArchiveTask: (taskId: string, reason: "deleted" | "canceled") => Promise<void>;
  handleRestoreTask: (taskId: string) => Promise<void>;
  refetchTasks: () => Promise<void>;
  filteredTasks: Task[];
  isPaidAccount: boolean;
  activeTab: TaskTab;
  setActiveTab: (tab: TaskTab) => void;
}

export const useTasksPageState = (): UseTasksPageStateReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | "staff" | null>(null);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<TaskTab>("my-tasks");
  const [isUpdating, setIsUpdating] = useState(false);

  const isPaidAccount = userRole === "individual" || userRole === "business";

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setUserRole("free");
          return;
        }
        
        const storedIsStaff = localStorage.getItem('isStaff');
        if (storedIsStaff === 'true') {
          console.log("User identified as staff from localStorage");
          setUserRole("staff");
          return;
        }
        
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', session.user.id)
          .maybeSingle();
          
        if (staffData) {
          console.log("User identified as staff from database");
          localStorage.setItem('isStaff', 'true');
          setUserRole("staff");
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

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    
    try {
      console.log('Fetching tasks for tab:', activeTab);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setTasks([]);
        setIsLoading(false);
        return;
      }
      
      if (userRole === "staff") {
        setTasks([]);
        setIsLoading(false);
        return;
      }
      
      let query = supabase
        .from('tasks')
        .select('*, subtasks:todo_items(*)')
        .eq('user_id', session.user.id);
        
      if (activeTab === 'archived') {
        query = query.not('archived_at', 'is', null);
      } else {
        query = query.is('archived_at', null);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
        
      if (error) throw error;
      
      console.log(`Fetched ${data.length} tasks for ${activeTab} tab`);
      
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
        subtasks: task.subtasks || [],
        archived_at: task.archived_at,
        archive_reason: task.archive_reason
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
  }, [activeTab, userRole]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, activeTab]);

  const handleCreateTask = async (taskData: any) => {
    if (userRole === "staff") {
      toast({
        title: "Access denied",
        description: "Staff accounts cannot create tasks",
        variant: "destructive"
      });
      return;
    }
    
    if (userRole === "free") {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to create tasks");
      }
      
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data: existingTasks, error: countError } = await supabase
        .from('tasks')
        .select('id')
        .eq('user_id', session.user.id)
        .gte('created_at', startOfMonth.toISOString());
        
      if (countError) throw countError;
      
      if (existingTasks && existingTasks.length >= 1) {
        toast({
          title: "Task limit reached",
          description: "Free accounts are limited to 1 task per month. Please upgrade to create more tasks.",
          variant: "destructive"
        });
        return;
      }
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to create tasks");
    }
    
    const taskToCreate = {
      title: taskData.title,
      description: taskData.description || null,
      status: "in-progress",
      priority: taskData.priority || "normal",
      due_date: taskData.due_date,
      due_time: taskData.due_time,
      is_recurring: taskData.is_recurring || false,
      user_id: session.user.id
    };
    
    console.log("Creating task with data:", taskToCreate);
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskToCreate)
      .select()
      .single();
      
    if (error) throw error;
    
    if (taskData.subtasks && taskData.subtasks.length > 0) {
      const subtasksToInsert = taskData.subtasks.map((subtask: any) => ({
        task_id: data.id,
        content: subtask.content,
        is_completed: subtask.is_completed || false,
        due_date: subtask.due_date || null,
        due_time: subtask.due_time || null
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
    
    await fetchTasks();
  };

  const handleUpdateTask = async (taskId: string, taskData: any) => {
    if (userRole === "staff") {
      toast({
        title: "Access denied",
        description: "Staff accounts cannot modify tasks",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const updateData = {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.due_date,
        due_time: taskData.due_time,
        updated_at: new Date().toISOString(),
        completed_at: taskData.status === "completed" ? new Date().toISOString() : null
      };
      
      console.log("Updating task with data:", updateData);
      
      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
        variant: "success"
      });
      
      await fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Failed to update task",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchiveTask = async (taskId: string, reason: "deleted" | "canceled") => {
    if (userRole === "staff") {
      toast({
        title: "Access denied",
        description: "Staff accounts cannot modify tasks",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log(`Archiving task ${taskId} with reason: ${reason}`);
      
      const updates = {
        status: "archived" as TaskStatus,
        archived_at: new Date().toISOString(),
        archive_reason: reason,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast({
        title: reason === "deleted" ? "Task deleted" : "Task canceled",
        description: `Task moved to archive. It will be permanently removed in 7 days.`,
        variant: "success"
      });
      
      setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
      
      setTimeout(() => {
        fetchTasks();
      }, 500);
      
    } catch (error) {
      console.error("Error archiving task:", error);
      toast({
        title: "Failed to archive task",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleRestoreTask = async (taskId: string) => {
    if (userRole === "staff") {
      toast({
        title: "Access denied",
        description: "Staff accounts cannot modify tasks",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log(`Restoring task ${taskId} from archive`);
      
      const { data: task } = await supabase
        .from('tasks')
        .select('status')
        .eq('id', taskId)
        .single();
        
      const updates = {
        status: "in-progress" as TaskStatus,
        archived_at: null,
        archive_reason: null,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast({
        title: "Task restored",
        description: "Task has been restored from the archive",
        variant: "success"
      });
      
      setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
      
      setTimeout(() => {
        fetchTasks();
      }, 500);
      
    } catch (error) {
      console.error("Error restoring task:", error);
      toast({
        title: "Failed to restore task",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery ? 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) : 
      true;
      
    const matchesStatus = !filterStatus || filterStatus === "all" ? true : task.status === filterStatus;
    
    const matchesPriority = !filterPriority || filterPriority === "all" ? true : task.priority === filterPriority;
    
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
    editTaskDialogOpen,
    setEditTaskDialogOpen,
    currentEditTask,
    setCurrentEditTask,
    handleCreateTask,
    handleUpdateTask,
    handleArchiveTask,
    handleRestoreTask,
    refetchTasks: fetchTasks,
    filteredTasks,
    isPaidAccount,
    activeTab,
    setActiveTab
  };
};
