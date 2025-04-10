
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isUserStaff, clearStaffCache } from '@/utils/staffUtils';
import { 
  TaskWithSharedInfo, 
  UseTaskQueriesReturn, 
  TaskTab 
} from './types';
import { 
  fetchMyTasks, 
  fetchSharedTasks, 
  fetchAssignedTasks,
  fetchTeamTasks,
  fetchDefaultTasks 
} from './fetchers';
import { UserRole } from "@/types/user";

export const useTaskQueries = (tab: TaskTab = "my-tasks"): UseTaskQueriesReturn => {
  const [tasks, setTasks] = useState<TaskWithSharedInfo[]>([]);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isStaff, setIsStaff] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        await clearStaffCache();
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) return;
        
        // Check if user is super admin
        const { data: superAdminData } = await supabase
          .from('super_admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (superAdminData) {
          setUserRole("super-admin");
          console.log("User role set to super-admin");
          return;
        }
        
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
          
          setUserRole((profileData?.account_type as UserRole) || "free");
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
      // For staff, we only support my-tasks tab now
      return await fetchMyTasks(session.user.id);
    } 
    
    // Since we've limited TaskTab to just "my-tasks", this is the only path
    // that will be executed
    return await fetchMyTasks(session.user.id);
  };

  const { data = [], isLoading, error, refetch: queryRefetch } = useQuery({
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

  // Create a wrapper for refetch that returns void to match our interface
  const refetch = async (): Promise<void> => {
    await queryRefetch();
  };

  return {
    tasks,
    isLoading,
    error,
    refetch,
    userRole,
    isStaff
  };
};
