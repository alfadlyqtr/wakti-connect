
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
import { AddSubtaskDialog } from "@/components/tasks/AddSubtaskDialog";
import { useTranslation } from "react-i18next";
import { 
  markTaskComplete, 
  markTaskPending, 
  deleteTask 
} from "@/services/task/taskService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DashboardTasks = () => {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | null>(null);
  const [activeTab, setActiveTab] = useState<TaskTab>("my-tasks");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [addSubtaskDialogOpen, setAddSubtaskDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleTaskAction = async (action: string, taskId: string) => {
    setSelectedTaskId(taskId);
    
    switch(action) {
      case "share":
        setShareDialogOpen(true);
        break;
      case "assign":
        setAssignDialogOpen(true);
        break;
      case "mark-complete":
        setIsProcessing(true);
        try {
          const success = await markTaskComplete(taskId);
          if (success) {
            toast({
              title: t('task.taskCompleted'),
              description: t('task.taskCompletedSuccess'),
            });
            refetch();
          }
        } finally {
          setIsProcessing(false);
        }
        break;
      case "mark-pending":
        setIsProcessing(true);
        try {
          const success = await markTaskPending(taskId);
          if (success) {
            toast({
              title: t('task.taskPending'),
              description: t('task.taskMarkedPending'),
            });
            refetch();
          }
        } finally {
          setIsProcessing(false);
        }
        break;
      case "delete":
        setDeleteConfirmOpen(true);
        break;
      case "add-subtask":
        setAddSubtaskDialogOpen(true);
        break;
      case "edit":
        toast({
          title: t('common.comingSoon'),
          description: t('task.editTaskComingSoon'),
        });
        break;
      default:
        toast({
          title: t('common.comingSoon'),
          description: t('task.actionComingSoon'),
        });
    }
  };

  const handleDeleteConfirmed = async () => {
    setIsProcessing(true);
    try {
      const success = await deleteTask(selectedTaskId);
      if (success) {
        toast({
          title: t('task.taskDeleted'),
          description: t('task.taskDeletedSuccess'),
        });
        refetch();
      }
    } finally {
      setIsProcessing(false);
      setDeleteConfirmOpen(false);
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
      
      <AddSubtaskDialog
        open={addSubtaskDialogOpen}
        onOpenChange={setAddSubtaskDialogOpen}
        taskId={selectedTaskId}
        onSuccess={refetch}
      />
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('task.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('task.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirmed}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardTasks;
