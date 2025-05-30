
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
        
        // First check localStorage for super admin status (faster)
        if (localStorage.getItem('isSuperAdmin') === 'true') {
          setUserRole("super-admin");
          console.log("User role set to super-admin from localStorage");
          return;
        }
        
        // Check if user is super admin
        const { data: superAdminData } = await supabase
          .from('super_admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (superAdminData) {
          setUserRole("super-admin");
          localStorage.setItem('isSuperAdmin', 'true');
          console.log("User role set to super-admin");
          return;
        } else {
          localStorage.setItem('isSuperAdmin', 'false');
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
          
          // Default to individual if account_type is not a valid UserRole
          const accountType = profileData?.account_type as string;
          if (accountType === 'business') {
            setUserRole('business');
          } else {
            setUserRole("individual");
          }
          console.log(`User role set to ${userRole || "individual"}`);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const queryKey = ['tasks', tab, isStaff, userRole];

  const fetchTasksData = async (): Promise<TaskWithSharedInfo[]> => {
    const { data: { session } } = await supabase.auth.getSession();
      
    if (!session) throw new Error("You must be logged in to view tasks");
    
    const staffCheck = isStaff || localStorage.getItem('isStaff') === 'true';
    
    if (staffCheck) {
      console.log("Fetching tasks as staff member, tab:", tab);
      return await fetchMyTasks(session.user.id);
    } 
    
    return await fetchMyTasks(session.user.id);
  };

  const { data = [], isLoading, error, refetch: queryRefetch } = useQuery({
    queryKey,
    queryFn: fetchTasksData,
    enabled: !!userRole,
    refetchOnWindowFocus: false,
    staleTime: 30000,
    refetchInterval: false
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const refetch = async (): Promise<void> => {
    await queryRefetch();
  };

  return {
    tasks,
    isLoading,
    error,
    refetch,
    userRole: userRole || 'individual',
    isStaff
  };
};
