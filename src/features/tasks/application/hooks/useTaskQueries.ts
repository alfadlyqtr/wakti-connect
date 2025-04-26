
import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { taskService } from "../../domain/services/taskService";
import { Task, TaskTab, TaskWithSharedInfo } from "../../domain/types";
import { UserRole } from "@/types/roles";

export const useTaskQueries = (tab: TaskTab = "my-tasks") => {
  const [tasks, setTasks] = useState<TaskWithSharedInfo[]>([]);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isStaff, setIsStaff] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) return;
        
        // Check if superadmin
        if (localStorage.getItem('isSuperAdmin') === 'true') {
          setUserRole("superadmin");
          return;
        }
        
        const { data: superAdminData } = await supabase
          .from('super_admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (superAdminData) {
          setUserRole("superadmin");
          localStorage.setItem('isSuperAdmin', 'true');
          return;
        } else {
          localStorage.setItem('isSuperAdmin', 'false');
        }
        
        // Check if staff
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle();
        
        const staffStatus = !!staffData;
        setIsStaff(staffStatus);
        
        if (staffStatus) {
          setUserRole("staff");
        } else {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();
          
          const accountType = profileData?.account_type as string;
          if (accountType === 'business') {
            setUserRole('business');
          } else {
            setUserRole("individual");
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const fetchTasks = async (): Promise<TaskWithSharedInfo[]> => {
    const { data: { session } } = await supabase.auth.getSession();
      
    if (!session) throw new Error("You must be logged in to view tasks");
    
    // For simplicity in this migration, we'll just fetch the user's own tasks
    const tasks = await taskService.getUserTasks(session.user.id);
    return tasks as TaskWithSharedInfo[];
  };

  const { data = [], isLoading, error, refetch: queryRefetch } = useQuery({
    queryKey: ['tasks', tab, isStaff, userRole],
    queryFn: fetchTasks,
    enabled: !!userRole,
    refetchOnWindowFocus: false,
    staleTime: 30000
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
