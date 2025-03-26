
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task.types';
import { isUserStaff, clearStaffCache } from '@/utils/staffUtils';
import { TaskWithSharedInfo, UseTaskQueriesReturn, TaskTab } from './types';

export const useTaskQueries = (tab: TaskTab = "my-tasks"): UseTaskQueriesReturn => {
  const [tasks, setTasks] = useState<TaskWithSharedInfo[]>([]);
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | "staff" | null>(null);
  const [isStaff, setIsStaff] = useState<boolean>(false);

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

  const queryKey = ['tasks', tab, isStaff, userRole];

  const { data = [], isLoading, error, refetch } = useQuery({
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

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  return {
    tasks,
    isLoading,
    error,
    refetch,
    userRole,
    isStaff
  };
};

// Helper function to fetch subtasks for tasks
async function fetchSubtasksForTasks(tasks: any[]): Promise<TaskWithSharedInfo[]> {
  if (!tasks || tasks.length === 0) return tasks;
  
  try {
    const taskIds = tasks.map(task => task.id);
    
    console.log("Fetching subtasks for task IDs:", taskIds);
    
    const { data: subtasksData, error: subtasksError } = await supabase
      .from('todo_items')
      .select('*')
      .in('task_id', taskIds);
      
    if (subtasksError) {
      console.error("Error fetching subtasks:", subtasksError);
      throw subtasksError;
    }
    
    console.log(`Fetched ${subtasksData?.length || 0} subtasks for ${taskIds.length} tasks`);
    
    if (subtasksData) {
      console.log("Sample subtask data:", subtasksData.length > 0 ? subtasksData[0] : "No subtasks found");
    }
    
    return tasks.map(task => ({
      ...task,
      subtasks: subtasksData?.filter(subtask => subtask.task_id === task.id) || []
    }));
  } catch (error) {
    console.error("Error in fetchSubtasksForTasks:", error);
    return tasks;
  }
}
