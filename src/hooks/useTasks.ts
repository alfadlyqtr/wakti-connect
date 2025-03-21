import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task.types";

export type TaskPriority = "normal" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "in-progress" | "completed" | "late";
export type TaskCategory = "daily" | "weekly" | "monthly" | "quarterly";
export type TaskTab = "my-tasks" | "shared-tasks" | "assigned-tasks";

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
      let result;
      
      if (tab === "my-tasks") {
        query = supabase
          .from('tasks')
          .select('*')
          .eq('user_id', session.user.id);
          
      } else if (tab === "shared-tasks") {
        // Check if the shared_tasks table exists and get the tasks shared with the user
        try {
          // First check the structure of shared_tasks table
          const { data: sharedTasksData, error: sharedError } = await supabase
            .from('shared_tasks')
            .select('id, task_id, shared_with')
            .eq('shared_with', session.user.id);
            
          if (sharedError) throw sharedError;
          
          // If we have shared tasks, fetch the actual task data
          if (sharedTasksData && sharedTasksData.length > 0) {
            const taskIds = sharedTasksData.map(item => item.task_id);
            
            const { data: taskData, error: taskError } = await supabase
              .from('tasks')
              .select('*, user_id as shared_by')
              .in('id', taskIds);
              
            if (taskError) throw taskError;
            
            // The tasks are now marked with the user_id as shared_by
            result = taskData;
          } else {
            result = [];
          }
        } catch (error) {
          console.error("Error fetching shared tasks:", error);
          result = [];
        }
        
      } else if (tab === "assigned-tasks") {
        // Check if user is business owner or staff
        if (userRole === "business" || userRole === "staff") {
          // Just use the tasks table with assignee_id filter
          query = supabase
            .from('tasks')
            .select('*')
            .eq('assignee_id', session.user.id);
        } else {
          // For other roles, just return empty array
          result = [];
        }
      }
      
      // If we already have results (from shared tasks), return them
      if (result) return result as TaskWithSharedInfo[];
      
      // Otherwise execute the query
      if (query) {
        // Apply status filter if not 'all'
        if (filterStatus !== "all") {
          query = query.eq('status', filterStatus);
        }
        
        // Apply priority filter if not 'all'
        if (filterPriority !== "all") {
          query = query.eq('priority', filterPriority);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return data as TaskWithSharedInfo[];
      }
      
      return [] as TaskWithSharedInfo[];
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
    tasks: filteredTasks,
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
