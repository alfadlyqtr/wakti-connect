
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
  const [businessId, setBusinessId] = useState<string | null>(null);

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
          
          // Get the business ID for staff member
          const cachedBusinessId = localStorage.getItem('staffBusinessId');
          if (cachedBusinessId) {
            setBusinessId(cachedBusinessId);
          }
          
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
          
          // Get the business ID for staff member
          const { data: staffData } = await supabase
            .from('business_staff')
            .select('business_id')
            .eq('staff_id', session.user.id)
            .eq('status', 'active')
            .maybeSingle();
            
          if (staffData?.business_id) {
            setBusinessId(staffData.business_id);
            localStorage.setItem('staffBusinessId', staffData.business_id);
          }
        } else {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();
          
          console.log(`Setting user role from profile: ${profileData?.account_type || "free"}`);
          setUserRole(profileData?.account_type || "free");
          
          // If this is a business account, store the ID
          if (profileData?.account_type === 'business') {
            setBusinessId(session.user.id);
          }
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
      
      if (notification.type === 'task_assigned' || notification.type === 'task_claimed') {
        clearStaffCache().then(() => {
          console.log("Staff cache cleared after task assignment/claim notification");
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
      
      // For staff on team tasks tab, this means they want to claim a task
      if (isUserStaffMember && activeTab === "team-tasks" && taskData.id) {
        console.log("Staff member claiming task:", taskData.id);
        
        const { data, error } = await supabase
          .from('tasks')
          .update({ assignee_id: localStorage.getItem('userId') })
          .eq('id', taskData.id)
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Task claimed",
          description: "The task has been assigned to you",
          variant: "success"
        });
      } else {
        // Regular task creation
        // For business users on the team tasks tab, mark it as a team task
        if (userRole === 'business' && activeTab === 'team-tasks') {
          taskData.is_team_task = true;
        }
        
        await createTask(taskData);
        
        toast({
          title: "Task created",
          description: "Your task has been created successfully",
          variant: "success"
        });
      }
      
      setCreateDialogOpen(false);
      
      // Make sure to refetch tasks after creation
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
    
    if (isUserStaffMember && newTab !== "assigned-tasks" && newTab !== "team-tasks") {
      console.log("Staff member attempted to switch to restricted tab");
      toast({
        title: "Tab restricted",
        description: "As a staff member, you can only view your tasks or team tasks",
      });
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
    refetch,
    businessId
  };
};
