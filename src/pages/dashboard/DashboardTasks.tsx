
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
import { TaskTab } from "@/types/task.types";
import RemindersContainer from "@/components/reminders/RemindersContainer";
import { useReminders } from "@/hooks/useReminders";

const DashboardTasks = () => {
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
  
  // Initialize the reminders hook
  const { requestNotificationPermission } = useReminders();

  // Redirect staff users away from tasks page
  // Super-admin users have full access to everything
  if (userRole === "staff") {
    return <Navigate to="/dashboard" replace />;
  }

  // Set default filters to "all" on component mount
  useEffect(() => {
    setFilterStatus("all");
    setFilterPriority("all");
    
    // Request notification permissions for reminders
    requestNotificationPermission();
  }, [setFilterStatus, setFilterPriority, requestNotificationPermission]);

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

  // Convert UserRole to the expected type for components that don't recognize super-admin yet
  const displayRole = userRole === 'super-admin' ? 'business' : userRole;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
      
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
            <h3 className="font-medium">Archived Tasks</h3>
            <p className="text-sm text-muted-foreground">
              These tasks have been archived and are no longer active.
            </p>
          </div>
        </div>
      )}
      
      {activeTab !== "reminders" && (
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
          userRole={displayRole as "free" | "individual" | "business" | "staff"}
          showCreateButton={activeTab === "my-tasks"}
        />
      )}
      
      {activeTab === "reminders" ? (
        <RemindersContainer 
          userRole={displayRole as "free" | "individual" | "business" | "staff"}
          isPaidAccount={isPaidAccount}
        />
      ) : (
        <TasksContainer
          tasks={filteredTasks}
          userRole={displayRole as "free" | "individual" | "business" | "staff"}
          refetch={refetchTasks}
          isPaidAccount={isPaidAccount}
          onCreateTask={() => setCreateTaskDialogOpen(true)}
          isArchiveView={activeTab === "archived"}
          onEdit={handleEditTask}
          onArchive={handleArchiveTask}
          onRestore={handleRestoreTask}
        />
      )}
      
      <CreateTaskDialog
        open={createTaskDialogOpen}
        onOpenChange={setCreateTaskDialogOpen}
        onCreateTask={handleCreateTask}
        userRole={displayRole as "free" | "individual" | "business" | "staff"}
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
