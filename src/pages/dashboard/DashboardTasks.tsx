
import React from "react";
import TaskControls from "@/components/tasks/TaskControls";
import TasksLoading from "@/components/tasks/TasksLoading";
import TasksContainer from "@/components/tasks/TasksContainer";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { useTasksPageState } from "@/components/tasks/useTasksPageState";
import { TaskStatusFilter, TaskPriorityFilter } from "@/components/tasks/types";

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

  // Cast the filter values to their appropriate types
  const statusFilter = filterStatus as TaskStatusFilter || "all";
  const priorityFilter = filterPriority as TaskPriorityFilter || "all";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
      
      <TaskControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={statusFilter}
        onStatusChange={(status) => setFilterStatus(status as string | null)}
        filterPriority={priorityFilter}
        onPriorityChange={(priority) => setFilterPriority(priority as string | null)}
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
