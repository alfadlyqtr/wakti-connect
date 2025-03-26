import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskTab, TaskStatus, TaskPriority } from "@/types/task.types";
import { isUserStaff, getStaffBusinessId, clearStaffCache } from "@/utils/staffUtils";
import { createTask as createTaskService } from "@/services/task/createService";

export type { TaskPriority, TaskStatus } from "@/types/task.types";
export type TaskCategory = "daily" | "weekly" | "monthly" | "quarterly";
export type { TaskTab } from "@/types/task.types";

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

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        await clearStaffCache();
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) return;
        
        const staffStatus = await isUserStaff();
        setIsStaff(staffStatus);
        
        if (staffStatus) {
          setUserRole("staff");
          console.log("User role set to staff");
        } else {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();
          
          setUserRole(profileData?.account_type || "free");
          console.log(`User role set to ${profileData?.account_type || "free"}`);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const queryKey = ['tasks', tab, filterStatus, filterPriority, isStaff, userRole];

  const { data: tasks = [], isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error("You must be logged in to view tasks");
      
      let query;
      let result;
      
      const staffCheck = await isUserStaff();
      
      if (staffCheck) {
        console.log("Fetching tasks as staff member, tab:", tab);
        if (tab === "my-tasks" || tab === "assigned-tasks") {
          console.log("Fetching assigned tasks for staff member:", session.user.id);
          query = supabase
            .from('tasks')
            .select('*')
            .eq('assignee_id', session.user.id);
            
          console.log("Query built for staff assigned tasks");
        } else {
          console.log("Staff members cannot see shared tasks, returning empty array");
          return [] as TaskWithSharedInfo[];
        }
      } else {
        console.log("Fetching tasks as regular user, tab:", tab);
        
        if (tab === "my-tasks") {
          query = supabase
            .from('tasks')
            .select('*')
            .eq('user_id', session.user.id);
            
        } else if (tab === "shared-tasks") {
          try {
            const { data: sharedTasksData, error: sharedError } = await supabase
              .from('shared_tasks')
              .select('id, task_id, shared_with')
              .eq('shared_with', session.user.id);
              
            if (sharedError) throw sharedError;
            
            if (sharedTasksData && sharedTasksData.length > 0) {
              const taskIds = sharedTasksData.map(item => item.task_id);
              
              const { data: taskData, error: taskError } = await supabase
                .from('tasks')
                .select('*, user_id as shared_by')
                .in('id', taskIds);
                
              if (taskError) throw taskError;
              
              result = taskData;
            } else {
              result = [];
            }
          } catch (error) {
            console.error("Error fetching shared tasks:", error);
            result = [];
          }
          
        } else if (tab === "assigned-tasks") {
          if (userRole === "business") {
            const businessId = session.user.id;
            query = supabase
              .from('tasks')
              .select('*')
              .eq('user_id', businessId);
          } else {
            query = supabase
              .from('tasks')
              .select('*')
              .eq('assignee_id', session.user.id);
          }
        }
      }
      
      if (result) {
        const tasksWithSubtasks = await fetchSubtasksForTasks(result);
        return tasksWithSubtasks;
      }
      
      if (query) {
        if (filterStatus !== "all") {
          query = query.eq('status', filterStatus);
        }
        
        if (filterPriority !== "all") {
          query = query.eq('priority', filterPriority);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error executing task query:", error);
          throw error;
        }
        
        console.log(`Query returned ${data?.length || 0} tasks`);
        
        const tasksWithSubtasks = await fetchSubtasksForTasks(data);
        return tasksWithSubtasks;
      }
      
      return [] as TaskWithSharedInfo[];
    },
    enabled: !!userRole,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  const fetchSubtasksForTasks = async (tasks: any[]): Promise<TaskWithSharedInfo[]> => {
    if (!tasks || tasks.length === 0) return tasks;
    
    try {
      const taskIds = tasks.map(task => task.id);
      
      const { data: subtasksData, error: subtasksError } = await supabase
        .from('todo_items')
        .select('*')
        .in('task_id', taskIds);
        
      if (subtasksError) throw subtasksError;
      
      console.log(`Fetched ${subtasksData?.length || 0} subtasks for ${taskIds.length} tasks`);
      
      return tasks.map(task => ({
        ...task,
        subtasks: subtasksData?.filter(subtask => subtask.task_id === task.id) || []
      }));
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      return tasks;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const searchLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  });

  const createTask = async (taskData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) throw new Error("You must be logged in to create a task");
    
    if (isStaff) {
      throw new Error("Staff members cannot create tasks");
    }
    
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
    
    const { recurring, ...taskDataWithoutRecurring } = taskData;
    
    const isRecurring = !!recurring && taskData.is_recurring;
    
    try {
      console.log("Creating task with data:", taskData);
      
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
