import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTasks, TaskTab } from "@/hooks/useTasks";
import TaskControls from "@/components/tasks/TaskControls";
import EmptyTasksState from "@/components/tasks/EmptyTasksState";
import TaskGrid from "@/components/tasks/TaskGrid";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { ShareTaskDialog } from "@/components/tasks/ShareTaskDialog";
import { AssignTaskDialog } from "@/components/tasks/AssignTaskDialog";
import { useTranslation } from "react-i18next";

const DashboardTasks = () => {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | null>(null);
  const [activeTab, setActiveTab] = useState<TaskTab>("my-tasks");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

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
    shareTask,
    assignTask,
    userRole: fetchedUserRole,
    refetch
  } = useTasks(activeTab);

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

  useEffect(() => {
    if (error) {
      toast({
        title: t('task.loadError'),
        description: error instanceof Error ? error.message : t('common.unknownError'),
        variant: "destructive",
      });
    }
  }, [error, t]);

  const isPaidAccount = userRole === "individual" || userRole === "business";

  const handleCreateTask = async (taskData: any) => {
    await createTask(taskData);
    setCreateDialogOpen(false);
  };

  const handleOpenCreateDialog = () => {
    if (activeTab === "shared-tasks") {
      setShareDialogOpen(true);
    } else if (activeTab === "assigned-tasks" && userRole === "business") {
      setAssignDialogOpen(true);
    } else {
      setCreateDialogOpen(true);
    }
  };

  const handleTabChange = (newTab: TaskTab) => {
    setActiveTab(newTab);
  };

  const handleShareTask = async (contactId: string) => {
    return await shareTask(selectedTaskId || "", contactId);
  };

  const handleAssignTask = async (staffId: string) => {
    return await assignTask(selectedTaskId || "", staffId);
  };

  const handleTaskAction = (action: string, taskId: string) => {
    setSelectedTaskId(taskId);
    
    switch(action) {
      case "share":
        setShareDialogOpen(true);
        break;
      case "assign":
        setAssignDialogOpen(true);
        break;
      default:
        toast({
          title: t('common.comingSoon'),
          description: t('task.actionComingSoon'),
        });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('task.tasksHeading')}</h1>
          <p className="text-muted-foreground">
            {t('task.tasksDescription')}
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
            <span className="ml-2">{t('task.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('task.tasksHeading')}</h1>
        <p className="text-muted-foreground">
          {t('task.tasksDescription')}
        </p>
      </div>
      
      <TaskControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onPriorityChange={setFilterPriority}
        onCreateTask={handleOpenCreateDialog}
        currentTab={activeTab}
        onTabChange={handleTabChange}
        isPaidAccount={isPaidAccount}
        userRole={userRole || "free"}
      />
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        {filteredTasks.length > 0 ? (
          <TaskGrid 
            tasks={filteredTasks} 
            userRole={userRole} 
            tab={activeTab}
            onTaskAction={handleTaskAction}
          />
        ) : (
          <EmptyTasksState 
            isPaidAccount={isPaidAccount} 
            onCreateTask={handleOpenCreateDialog} 
            tab={activeTab}
          />
        )}
      </div>
      
      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateTask={handleCreateTask}
        userRole={userRole || "free"}
      />
      
      <ShareTaskDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        taskId={selectedTaskId}
        onShare={handleShareTask}
      />
      
      <AssignTaskDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        taskId={selectedTaskId}
        onAssign={handleAssignTask}
      />
    </div>
  );
};

export default DashboardTasks;
