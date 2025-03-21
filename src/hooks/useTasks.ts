
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TaskPriority = "normal" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "in-progress" | "completed" | "late";
export type TaskCategory = "daily" | "weekly" | "monthly" | "quarterly";
export type TaskTab = "my-tasks" | "shared-tasks" | "assigned-tasks";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  due_date: string;
  user_id: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  is_recurring: boolean;
  recurring: any;
}

export interface TaskWithSharedInfo extends Task {
  shared_with?: string[];
  shared_by?: string;
  assigned_by?: string;
  assigned_to?: string;
}

export const useTasks = (tab: TaskTab = "my-tasks") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | "staff" | null>(null);
  const queryClient = useQueryClient();

  // Fetch user role for permission checks
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) return;
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();
        
        setUserRole(profileData?.account_type || "free");
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  // Define the query key based on the active tab
  const queryKey = ['tasks', tab, filterStatus, filterPriority];

  // Task fetching query
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error("You must be logged in to view tasks");
      
      let query;
      
      if (tab === "my-tasks") {
        query = supabase
          .from('tasks')
          .select('*, shared_tasks!inner(*)')
          .eq('user_id', session.user.id);
      } else if (tab === "shared-tasks") {
        query = supabase
          .from('shared_tasks')
          .select('tasks!inner(*, shared_tasks!inner(*))')
          .eq('shared_with', session.user.id);
      } else if (tab === "assigned-tasks") {
        if (userRole === "business" || userRole === "staff") {
          query = supabase
            .from('assigned_tasks')
            .select('tasks!inner(*)')
            .eq('assigned_by', session.user.id);
        } else {
          query = supabase
            .from('assigned_tasks')
            .select('tasks!inner(*)')
            .eq('assigned_to', session.user.id);
        }
      }
      
      // Apply status filter if not 'all'
      if (filterStatus !== "all") {
        query = query.eq('tasks.status', filterStatus);
      }
      
      // Apply priority filter if not 'all'
      if (filterPriority !== "all") {
        query = query.eq('tasks.priority', filterPriority);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Format the response based on the tab
      let formattedTasks;
      
      if (tab === "shared-tasks") {
        formattedTasks = data.map((item: any) => ({
          ...item.tasks,
          shared_by: item.shared_by
        }));
      } else if (tab === "assigned-tasks") {
        formattedTasks = data.map((item: any) => ({
          ...item.tasks,
          assigned_by: item.assigned_by,
          assigned_to: item.assigned_to
        }));
      } else {
        formattedTasks = data;
      }
      
      return formattedTasks as TaskWithSharedInfo[];
    },
    enabled: !!userRole, // Only run the query if we have the user role
  });

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => {
    const searchLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  });

  // Create task mutation
  const createTask = async (taskData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) throw new Error("You must be logged in to create a task");
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...taskData, user_id: session.user.id }])
      .select();
      
    if (error) throw error;
    
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    
    return data;
  };

  return {
    tasks,
    filteredTasks,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    createTask,
    userRole
  };
};
