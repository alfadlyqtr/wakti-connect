
import React, { useEffect } from "react";
import TaskControls from "@/components/tasks/TaskControls";
import TasksLoading from "@/components/tasks/TasksLoading";
import TaskGrid from "@/components/tasks/TaskGrid";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { EditTaskDialog } from "@/components/tasks/EditTaskDialog";
import { useTasksPageState } from "@/hooks/tasks/useTasksPageState";
import { TaskStatusFilter, TaskPriorityFilter } from "@/components/tasks/types";
import TaskTabs from "@/components/tasks/TaskTabs";
import { Archive } from "lucide-react";
import { Navigate } from "react-router-dom";
import { UserRole } from "@/types/user";
import TasksContainer from "@/components/tasks/TasksContainer";
import { useTranslation } from "react-i18next";
import { TaskTab } from "@/types/task.types";

const DashboardTasks = () => {
  const { t } = useTranslation();
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    userRole,
    createTaskDialogOpen,
    setCreateTaskDialogOpen,
    editTaskDialogOpen,
    setEditTaskDialogOpen,
    currentEditTask,
    setCurrentEditTask,
    handleCreateTask,
    handleUpdateTask,
    handleArchiveTask,
    handleRestoreTask,
    refetchTasks,
    filteredTasks,
    isPaidAccount,
    activeTab,
    setActiveTab
  } = useTasksPageState();

  // Redirect staff users away from tasks page
  // Cast userRole to UserRole to ensure TypeScript recognizes "staff" as a valid option
  if ((userRole as UserRole) === "staff") {
    return <Navigate to="/dashboard" replace />;
  }

  // Set default filters to "all" on component mount
  useEffect(() => {
    setFilterStatus("all");
    setFilterPriority("all");
  }, [setFilterStatus, setFilterPriority]);

  if (isLoading) {
    return <TasksLoading />;
  }

  // Cast the filter values to their appropriate types
  const statusFilter = (filterStatus || "all") as TaskStatusFilter;
  const priorityFilter = (filterPriority || "all") as TaskPriorityFilter;
  
  // When a task is selected for editing
  const handleEditTask = (task: any) => {
    setCurrentEditTask(task);
    setEditTaskDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("task.tasks")}</h1>
      
      <TaskTabs 
        activeTab={activeTab}
        onTabChange={(tab) => {
          console.log(`Changing to tab: ${tab}`);
          setActiveTab(tab as TaskTab);
        }}
      />
      
      {activeTab === "archived" && (
        <div className="bg-muted/50 rounded-lg p-4 flex items-center">
          <Archive className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <h3 className="font-medium">{t("task.archive.title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("task.archive.description")}
            </p>
          </div>
        </div>
      )}
      
      <TaskControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={statusFilter}
        onStatusChange={(status) => {
          console.log(`Setting status filter to: ${status}`);
          setFilterStatus(status as string | null);
        }}
        filterPriority={priorityFilter}
        onPriorityChange={(priority) => {
          console.log(`Setting priority filter to: ${priority}`);
          setFilterPriority(priority as string | null);
        }}
        onCreateTask={() => setCreateTaskDialogOpen(true)}
        isPaidAccount={isPaidAccount}
        userRole={userRole || "free"}
        showCreateButton={activeTab === "my-tasks"}
      />
      
      <TasksContainer
        tasks={filteredTasks}
        userRole={userRole}
        refetch={refetchTasks}
        isPaidAccount={isPaidAccount}
        onCreateTask={() => setCreateTaskDialogOpen(true)}
        isArchiveView={activeTab === "archived"}
        onEdit={handleEditTask}
        onArchive={handleArchiveTask}
        onRestore={handleRestoreTask}
      />
      
      <CreateTaskDialog
        open={createTaskDialogOpen}
        onOpenChange={setCreateTaskDialogOpen}
        onCreateTask={handleCreateTask}
        userRole={userRole || "free"}
      />
      
      <EditTaskDialog
        open={editTaskDialogOpen}
        onOpenChange={setEditTaskDialogOpen}
        task={currentEditTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
};

export default DashboardTasks;
