
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTasks } from "@/hooks/useTasks";
import TaskControls from "@/components/tasks/TaskControls";
import EmptyTasksState from "@/components/tasks/EmptyTasksState";
import TaskGrid from "@/components/tasks/TaskGrid";

const DashboardTasks = () => {
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | null>(null);
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
    createTask
  } = useTasks();

  // Fetch user role
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) return;
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();
        
        setUserRole(profileData?.account_type || "free");
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    getUserRole();
  }, []);

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load tasks",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }, [error]);

  const isPaidAccount = userRole === "individual" || userRole === "business";

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
          Manage your tasks and track your progress.
        </p>
      </div>
      
      <TaskControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onPriorityChange={setFilterPriority}
        onCreateTask={createTask}
        isPaidAccount={isPaidAccount}
      />
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        {filteredTasks.length > 0 ? (
          <TaskGrid tasks={filteredTasks} userRole={userRole} />
        ) : (
          <EmptyTasksState isPaidAccount={isPaidAccount} onCreateTask={createTask} />
        )}
      </div>
    </div>
  );
};

export default DashboardTasks;
