import React, { useEffect } from "react";
import TaskControls from "@/components/tasks/TaskControls";
import TasksLoading from "@/components/tasks/TasksLoading";
import { TaskGrid } from "@/components/tasks/TaskGrid";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { EditTaskDialog } from "@/components/tasks/EditTaskDialog";
import { useTasksPageState } from "@/hooks/tasks/useTasksPageState";
import { TaskStatusFilter, TaskPriorityFilter } from "@/components/tasks/types";
import TaskTabs from "@/components/tasks/TaskTabs";
import { Navigate } from "react-router-dom";
import { UserRole } from "@/types/user";
import TasksContainer from "@/components/tasks/TasksContainer";
import { TaskTab, Task, TaskFormData, TaskStatus, TaskPriority } from "@/types/task.types";
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
    refetchTasks,
    filteredTasks,
    isPaidAccount,
    activeTab,
    setActiveTab,
    deleteTask
  } = useTasksPageState();
  
  const { requestNotificationPermission } = useReminders();

  if (userRole === "staff") {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    setFilterStatus("all");
    setFilterPriority("all");
    
    requestNotificationPermission();
  }, [setFilterStatus, setFilterPriority, requestNotificationPermission]);

  if (isLoading) {
    return <TasksLoading />;
  }

  const statusFilter = (filterStatus || "all") as TaskStatusFilter;
  const priorityFilter = (filterPriority || "all") as TaskPriorityFilter;
  
  const handleEditTask = (task: any) => {
    setCurrentEditTask(task);
    setEditTaskDialogOpen(true);
  };

  const displayRole = userRole === 'super-admin' ? 'business' : userRole;

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    await refetchTasks();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
      
      <TaskTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {activeTab !== "reminders" && (
        <TaskControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={statusFilter}
          onStatusChange={setFilterStatus}
          filterPriority={priorityFilter}
          onPriorityChange={setFilterPriority}
          onCreateTask={() => setCreateTaskDialogOpen(true)}
          isPaidAccount={isPaidAccount}
          userRole={displayRole as "individual" | "business" | "staff"}
          showCreateButton={activeTab === "my-tasks"}
        />
      )}
      
      {activeTab === "reminders" ? (
        <RemindersContainer 
          userRole={displayRole as "individual" | "business" | "staff"}
          isPaidAccount={isPaidAccount}
        />
      ) : (
        <TasksContainer
          tasks={filteredTasks}
          userRole={displayRole as "individual" | "business" | "staff"}
          refetch={refetchTasks}
          isPaidAccount={isPaidAccount}
          onCreateTask={() => setCreateTaskDialogOpen(true)}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          activeTab={activeTab}
        />
      )}
      
      <CreateTaskDialog
        open={createTaskDialogOpen}
        onOpenChange={setCreateTaskDialogOpen}
        onCreateTask={(taskData: TaskFormData): Promise<Task> => {
          return handleCreateTask(taskData);
        }}
        userRole={displayRole as "individual" | "business" | "staff"}
      />
      
      <EditTaskDialog
        open={editTaskDialogOpen}
        onOpenChange={setEditTaskDialogOpen}
        task={currentEditTask}
        onUpdateTask={(taskId: string, taskData: any): Promise<void> => {
          return handleUpdateTask(taskId, taskData);
        }}
      />
    </div>
  );
};

export default DashboardTasks;
