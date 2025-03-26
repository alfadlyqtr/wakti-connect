
import React from "react";
import { useTasksPageState } from "@/components/tasks/useTasksPageState";
import TaskControls from "@/components/tasks/TaskControls";
import TasksLoading from "@/components/tasks/TasksLoading";
import TasksHeader from "@/components/tasks/TasksHeader";
import TasksContainer from "@/components/tasks/TasksContainer";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { TaskStatusFilter, TaskPriorityFilter } from "@/components/tasks/types";

const DashboardTasks = () => {
  const {
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
    refetch
  } = useTasksPageState();

  if (isLoading || !initialCheckDone) {
    return <TasksLoading />;
  }

  return (
    <div className="space-y-6">
      <TasksHeader isStaffMember={isUserStaffMember} />
      
      <TaskControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus as TaskStatusFilter}
        onStatusChange={setFilterStatus}
        filterPriority={filterPriority as TaskPriorityFilter}
        onPriorityChange={setFilterPriority}
        onCreateTask={() => setCreateDialogOpen(true)}
        currentTab={activeTab}
        onTabChange={handleTabChange}
        isPaidAccount={isPaidAccount}
        userRole={userRole || "free"}
        isStaff={isUserStaffMember}
      />
      
      <TasksContainer
        tasks={filteredTasks}
        userRole={userRole}
        tab={activeTab}
        refetch={refetch}
        isPaidAccount={isPaidAccount}
        isStaff={isUserStaffMember}
        onCreateTask={() => setCreateDialogOpen(true)}
      />
      
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
