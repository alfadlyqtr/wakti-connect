
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in-progress" | "completed" | "late";
  priority: "urgent" | "high" | "medium" | "normal";
  due_date: string | null;
  user_id: string;
  assignee_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskTab = "my-tasks" | "shared-tasks" | "assigned-tasks";

interface TasksResult {
  tasks: Task[];
  userRole: "free" | "individual" | "business";
}

export const useTasks = (tab: TaskTab = "my-tasks") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Fetch tasks with React Query
  const { 
    data: tasks, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<TasksResult>({
    queryKey: ['tasks', tab],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Get user profile to check account type
      const { data: profileData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
      
      const userRole = profileData?.account_type || "free";
      
      let query;
      
      switch (tab) {
        case "my-tasks":
          // User's own tasks
          query = supabase
            .from('tasks')
            .select('*')
            .eq('user_id', session.user.id)
            .order('due_date', { ascending: true });
          break;
          
        case "shared-tasks":
          // Tasks shared with the user
          query = supabase
            .from('shared_tasks')
            .select('task_id, tasks(*)')
            .eq('shared_with', session.user.id)
            .order('created_at', { ascending: false });
          break;
          
        case "assigned-tasks":
          // Tasks assigned to the user (for staff members)
          query = supabase
            .from('tasks')
            .select('*')
            .eq('assignee_id', session.user.id)
            .order('due_date', { ascending: true });
          break;
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Error fetching ${tab}:`, error);
        throw error;
      }
      
      // Transform shared tasks data if needed
      let transformedData;
      if (tab === "shared-tasks") {
        transformedData = data.map((item: any) => item.tasks);
      } else {
        transformedData = data;
      }
      
      return { 
        tasks: transformedData as Task[],
        userRole
      };
    },
    refetchOnWindowFocus: false,
  });

  // Create a new task
  const createTask = async (taskData: Partial<Task>) => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create tasks",
          variant: "destructive",
        });
        return;
      }

      const newTask = {
        user_id: session.user.id,
        title: taskData.title || "New Task",
        description: taskData.description || "",
        status: taskData.status || "pending",
        priority: taskData.priority || "normal",
        due_date: taskData.due_date || new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        assignee_id: taskData.assignee_id || null
      } as any; // Using 'as any' to bypass the type check for now

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Task Created",
        description: "New task has been created successfully",
      });

      // Refetch tasks to update the list
      refetch();
      
      return data[0];
    } catch (error: any) {
      toast({
        title: "Failed to create task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Filter tasks based on search and filters
  const getFilteredTasks = () => {
    const taskList = tasks?.tasks || [];
    
    return taskList.filter((task) => {
      // Search filter
      const matchesSearch = searchQuery 
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // Status filter
      const matchesStatus = filterStatus === "all" ? true : task.status === filterStatus;
      
      // Priority filter
      const matchesPriority = filterPriority === "all" ? true : task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  // Share a task with another user
  const shareTask = async (taskId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('shared_tasks')
        .insert({
          task_id: taskId,
          shared_with: userId
        });

      if (error) throw error;

      toast({
        title: "Task Shared",
        description: "Task has been shared successfully",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Failed to share task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Assign a task to a staff member (for business accounts)
  const assignTask = async (taskId: string, staffId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ assignee_id: staffId })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task Assigned",
        description: "Task has been assigned successfully",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Failed to assign task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    tasks: tasks?.tasks || [],
    userRole: tasks?.userRole || "free",
    filteredTasks: getFilteredTasks(),
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    createTask,
    shareTask,
    assignTask,
    refetch
  };
};
