import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task.types";
import { isUserStaff, getStaffBusinessId } from "@/utils/staffUtils";
import { createTask as createTaskService } from "@/services/task/createService";

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
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Fetch user role for permission checks
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) return;
        
        // Check if user is staff first
        const staffStatus = await isUserStaff();
        setIsStaff(staffStatus);
        
        if (staffStatus) {
          setUserRole("staff");
        } else {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();
          
          setUserRole(profileData?.account_type || "free");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  // Define the query key based on the active tab
  const queryKey = ['tasks', tab, filterStatus, filterPriority, isStaff];

  // Task fetching query
  const { data: tasks = [], isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error("You must be logged in to view tasks");
      
      let query;
      let result;
      
      // Special handling for staff members
      if (isStaff) {
        // For staff members, we only show assigned tasks regardless of tab
        if (tab === "my-tasks" || tab === "assigned-tasks") {
          // In staff view, my-tasks tab will show tasks assigned to them
          query = supabase
            .from('tasks')
            .select('*')
            .eq('assignee_id', session.user.id);
        } else {
          // Staff should not see shared tasks, return empty array
          return [] as TaskWithSharedInfo[];
        }
      } else {
        // Normal processing for non-staff users
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
          if (userRole === "business") {
            // Get all tasks where this business assigned tasks
            const businessId = session.user.id;
            query = supabase
              .from('tasks')
              .select('*')
              .eq('user_id', businessId);
          } else {
            // For staff and other roles with assigned tasks
            query = supabase
              .from('tasks')
              .select('*')
              .eq('assignee_id', session.user.id);
          }
        }
      }
      
      // If we already have results (from shared tasks), return them
      if (result) {
        // We still need to fetch subtasks for these tasks
        const tasksWithSubtasks = await fetchSubtasksForTasks(result);
        return tasksWithSubtasks;
      }
      
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
        
        // Fetch subtasks for the tasks
        const tasksWithSubtasks = await fetchSubtasksForTasks(data);
        return tasksWithSubtasks;
      }
      
      return [] as TaskWithSharedInfo[];
    },
    enabled: !!userRole, // Only run the query if we have the user role
  });

  // Helper function to fetch subtasks for tasks
  const fetchSubtasksForTasks = async (tasks: any[]): Promise<TaskWithSharedInfo[]> => {
    if (!tasks || tasks.length === 0) return tasks;
    
    try {
      const taskIds = tasks.map(task => task.id);
      
      const { data: subtasksData, error: subtasksError } = await supabase
        .from('todo_items')
        .select('*')
        .in('task_id', taskIds);
        
      if (subtasksError) throw subtasksError;
      
      // Add subtasks to their respective tasks
      return tasks.map(task => ({
        ...task,
        subtasks: subtasksData?.filter(subtask => subtask.task_id === task.id) || []
      }));
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      return tasks;
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => {
    const searchLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  });

  // Create task mutation - UPDATED to use the task service
  const createTask = async (taskData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) throw new Error("You must be logged in to create a task");
    
    // If staff, throw error (staff should not create tasks)
    if (isStaff) {
      throw new Error("Staff members cannot create tasks");
    }
    
    // If free account, check if already created a task this month
    if (userRole === "free") {
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
        throw new Error("Free accounts can only create one task per month. Upgrade to create more tasks.");
      }
    }
    
    // Extract recurring data from taskData
    const { recurring, ...taskDataWithoutRecurring } = taskData;
    
    // Check if this is a recurring task
    const isRecurring = !!recurring && taskData.is_recurring;
    
    try {
      // Use the task service which correctly handles recurring settings
      const createdTask = await createTaskService(
        taskDataWithoutRecurring, 
        isRecurring ? recurring : undefined
      );
      
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      return createdTask;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
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
    userRole,
    isStaff,
    refetch
  };
};
