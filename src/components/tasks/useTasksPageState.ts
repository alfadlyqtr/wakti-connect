
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { isUserStaff, clearStaffCache } from "@/utils/staffUtils";
import { TaskTab } from '@/types/task.types';
import { toast } from "@/components/ui/use-toast";
import { useTasks } from "@/hooks/tasks";
import { subscribeToNotifications } from "@/services/notifications";

export const useTasksPageState = () => {
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | "staff" | null>(null);
  const [isUserStaffMember, setIsUserStaffMember] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskTab>("my-tasks");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Get user role and staff status only once at component mount
  useEffect(() => {
    const getUserRole = async () => {
      try {
        // Check localStorage first for faster loading and to prevent unnecessary db calls
        const cachedIsStaff = localStorage.getItem('isStaff') === 'true';
        
        if (cachedIsStaff) {
          console.log("Using cached staff status: true");
          setIsUserStaffMember(true);
          setUserRole('staff');
          setActiveTab('assigned-tasks');
          setInitialCheckDone(true);
          return;
        }
        
        // If not in cache, do a fresh check
        await clearStaffCache();
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setInitialCheckDone(true);
          return;
        }
        
        const staffStatus = await isUserStaff();
        setIsUserStaffMember(staffStatus);
        
        if (staffStatus) {
          console.log("User is staff member, setting appropriate role and tab");
          setUserRole('staff');
          setActiveTab('assigned-tasks');
        } else {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();
          
          console.log(`Setting user role from profile: ${profileData?.account_type || "free"}`);
          setUserRole(profileData?.account_type || "free");
        }
        
        setInitialCheckDone(true);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setInitialCheckDone(true);
      }
    };

    getUserRole();
  }, []);

  // Use the tasks hook after determining the user role and active tab
  const { 
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
    userRole: fetchedUserRole,
    isStaff: isStaffFromHook,
    refetch
  } = useTasks(activeTab);

  // Set up notification subscription
  useEffect(() => {
    if (!initialCheckDone) return;
    
    const unsubscribe = subscribeToNotifications((notification) => {
      console.log("Received new notification:", notification);
      
      if (notification.type.includes('task')) {
        console.log("Task-related notification received, refetching tasks");
        refetch();
      }
      
      if (notification.type === 'task_assigned') {
        clearStaffCache().then(() => {
          console.log("Staff cache cleared after task assignment notification");
          refetch();
        });
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [initialCheckDone, refetch]);

  // Error handling
  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load tasks",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }, [error]);

  const isPaidAccount = userRole === "individual" || userRole === "business" || userRole === "staff";

  const handleCreateTask = async (taskData: any) => {
    try {
      console.log("Creating task with data:", taskData);
      await createTask(taskData);
      setCreateDialogOpen(false);
      setTimeout(() => {
        refetch();
      }, 300);
    } catch (error) {
      console.error("Error in handleCreateTask:", error);
      toast({
        title: "Failed to create task",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (newTab: TaskTab) => {
    console.log(`Changing tab from ${activeTab} to ${newTab}`);
    
    if (isUserStaffMember && newTab !== "assigned-tasks") {
      console.log("Staff member attempted to switch to non-assigned tab, redirecting");
      return; // Don't change the tab for staff members
    }
    
    setActiveTab(newTab);
    
    setTimeout(() => {
      refetch();
    }, 100);
  };

  return {
    userRole,
    isUserStaffMember,
    activeTab,
    createDialogOpen,
    setCreateDialogOpen,
    initialCheckDone,
    filteredTasks,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    isPaidAccount,
    handleCreateTask,
    handleTabChange,
    refetch
  };
};
