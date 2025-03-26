
import React from "react";
import TaskControls from "@/components/tasks/TaskControls";
import TasksLoading from "@/components/tasks/TasksLoading";
import TasksContainer from "@/components/tasks/TasksContainer";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { useTasksPageState } from "@/components/tasks/useTasksPageState";

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
    handleCreateTask,
    refetchTasks,
    filteredTasks,
    isPaidAccount
  } = useTasksPageState();

  if (isLoading) {
    return <TasksLoading />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
      
      <TaskControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onPriorityChange={setFilterPriority}
        onCreateTask={() => setCreateTaskDialogOpen(true)}
        isPaidAccount={isPaidAccount}
        userRole={userRole || "free"}
      />
      
      <TasksContainer
        tasks={filteredTasks}
        userRole={userRole}
        refetch={refetchTasks}
        isPaidAccount={isPaidAccount}
        onCreateTask={() => setCreateTaskDialogOpen(true)}
      />
      
      <CreateTaskDialog
        open={createTaskDialogOpen}
        onOpenChange={setCreateDialogOpen => {
          setCreateTaskDialogOpen(setCreateDialogOpen);
        }}
        onCreateTask={handleCreateTask}
        userRole={userRole || "free"}
      />
    </div>
  );
};

export default DashboardTasks;
