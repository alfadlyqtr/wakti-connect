
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTasks, TaskTab, TaskWithSharedInfo } from "@/hooks/useTasks";
import TaskControls from "@/components/tasks/TaskControls";
import EmptyTasksState from "@/components/tasks/EmptyTasksState";
import TaskGrid from "@/components/tasks/TaskGrid";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { isUserStaff, clearStaffCache } from "@/utils/staffUtils";
import { subscribeToNotifications } from "@/services/notifications";

const DashboardTasks = () => {
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | "staff" | null>(null);
  const [isUserStaffMember, setIsUserStaffMember] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskTab>("my-tasks");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
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

  useEffect(() => {
    const getUserRole = async () => {
      try {
        // Clear staff cache to ensure we have fresh data
        await clearStaffCache();
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) return;
        
        // Check if user is staff
        const staffStatus = await isUserStaff();
        setIsUserStaffMember(staffStatus);
        
        if (staffStatus) {
          console.log("User is staff member, setting appropriate role and tab");
          setUserRole('staff');
          setActiveTab('assigned-tasks');
        } else {
          // Get regular user role from profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();
          
          console.log(`Setting user role from profile: ${profileData?.account_type || "free"}`);
          setUserRole(profileData?.account_type || "free");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    getUserRole();
    
    // Subscribe to notifications for real-time updates
    const unsubscribe = subscribeToNotifications((notification) => {
      console.log("Received new notification:", notification);
      
      // If task-related notification, refetch tasks
      if (notification.type.includes('task')) {
        console.log("Task-related notification received, refetching tasks");
        refetch();
      }
      
      // For assigned tasks, also clear staff cache to ensure fresh data
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
  }, [refetch]);

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
      // Refresh the task list
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
      // Keep dialog open so user can try again
    }
  };

  const handleTabChange = (newTab: TaskTab) => {
    console.log(`Changing tab from ${activeTab} to ${newTab}`);
    setActiveTab(newTab);
    
    // Staff members should only see assigned tasks
    if (isUserStaffMember && newTab !== "assigned-tasks") {
      console.log("Staff member attempted to switch to non-assigned tab, redirecting");
      setActiveTab("assigned-tasks");
      return;
    }
    
    // Force refetch when changing tabs
    setTimeout(() => {
      refetch();
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and track your progress.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
            <span className="ml-2">Loading tasks...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          {isUserStaffMember 
            ? "View and manage tasks assigned to you."
            : "Manage your tasks and track your progress."}
        </p>
      </div>
      
      <TaskControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onPriorityChange={setFilterPriority}
        onCreateTask={() => setCreateDialogOpen(true)}
        currentTab={activeTab}
        onTabChange={handleTabChange}
        isPaidAccount={isPaidAccount}
        userRole={userRole || "free"}
        isStaff={isUserStaffMember}
      />
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        {filteredTasks.length > 0 ? (
          <TaskGrid 
            tasks={filteredTasks} 
            userRole={userRole} 
            tab={activeTab}
            refetch={refetch}
          />
        ) : (
          <EmptyTasksState 
            isPaidAccount={isPaidAccount} 
            onCreateTask={() => setCreateDialogOpen(true)} 
            tab={activeTab}
            isStaff={isUserStaffMember}
          />
        )}
      </div>
      
      {!isUserStaffMember && (
        <CreateTaskDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreateTask={handleCreateTask}
          userRole={userRole || "free"}
        />
      )}
    </div>
  );
};

export default DashboardTasks;
