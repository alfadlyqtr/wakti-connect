import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isUserStaff, clearStaffCache } from '@/utils/staffUtils';
import { TaskWithSharedInfo, UseTaskQueriesReturn, TaskTab } from './types';
import { 
  fetchMyTasks, 
  fetchSharedTasks, 
  fetchAssignedTasks,
  fetchTeamTasks,
  fetchDefaultTasks 
} from './fetchers';

export const useTaskQueries = (tab: TaskTab = "my-tasks"): UseTaskQueriesReturn => {
  const [tasks, setTasks] = useState<TaskWithSharedInfo[]>([]);
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | "staff" | null>(null);
  const [isStaff, setIsStaff] = useState<boolean>(false);

  // Fetch user role and staff status only once on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Use cached staff status if available to prevent unnecessary database calls
        const cachedIsStaff = localStorage.getItem('isStaff') === 'true';
        
        if (cachedIsStaff) {
          setIsStaff(true);
          setUserRole("staff");
          console.log("Using cached staff status: true");
          return;
        }
        
        // Otherwise do a fresh check
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

  // Define the query function to use the appropriate fetcher based on tab and user role
  const fetchTasksData = async (): Promise<TaskWithSharedInfo[]> => {
    const { data: { session } } = await supabase.auth.getSession();
      
    if (!session) throw new Error("You must be logged in to view tasks");
    
    // Re-check staff status to ensure it's up to date
    const staffCheck = isStaff || localStorage.getItem('isStaff') === 'true';
    
    if (staffCheck) {
      console.log("Fetching tasks as staff member, tab:", tab);
      if (tab === "my-tasks" || tab === "assigned-tasks") {
        return await fetchAssignedTasks(session.user.id);
      } else {
        console.log("Staff members cannot see shared tasks, returning empty array");
        return [];
      }
    } 
    
    // Handle regular users based on the selected tab
    switch (tab) {
      case "my-tasks":
        return await fetchMyTasks(session.user.id);
      
      case "shared-tasks":
        return await fetchSharedTasks(session.user.id);
      
      case "assigned-tasks":
        if (userRole === "business") {
          return await fetchAssignedTasks(session.user.id, true);
        } else {
          return await fetchAssignedTasks(session.user.id);
        }
      
      case "team-tasks":
        if (userRole === "business") {
          return await fetchTeamTasks(session.user.id);
        }
        return [];
      
      default:
        return await fetchDefaultTasks(session.user.id);
    }
  };

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchTasksData,
    enabled: !!userRole,
    refetchOnWindowFocus: false,
    staleTime: 30000,
    refetchInterval: false // Prevent continuous refetching
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
