
import React, { useEffect } from "react";
import TaskControls from "@/components/tasks/TaskControls";
import TasksLoading from "@/components/tasks/TasksLoading";
import TaskGrid from "@/components/tasks/TaskGrid";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { EditTaskDialog } from "@/components/tasks/EditTaskDialog";
import { useTasksPageState } from "@/components/tasks/useTasksPageState";
import { TaskStatusFilter, TaskPriorityFilter } from "@/components/tasks/types";
import TaskTabs from "@/components/tasks/TaskTabs";
import { Archive } from "lucide-react";
import { Navigate } from "react-router-dom";

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

  // Redirect staff users away from tasks page
  if (userRole === "staff") {
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
      <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
      
      <TaskTabs 
        activeTab={activeTab}
        onTabChange={(tab) => {
          console.log(`Changing to tab: ${tab}`);
          setActiveTab(tab);
        }}
      />
      
      {activeTab === "archived" && (
        <div className="bg-muted/50 rounded-lg p-4 flex items-center">
          <Archive className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Archive</h3>
            <p className="text-sm text-muted-foreground">
              Tasks shown here will be permanently deleted after 7 days.
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
      
      {filteredTasks.length > 0 ? (
        <TaskGrid
          tasks={filteredTasks}
          userRole={userRole}
          refetch={refetchTasks}
          isArchiveView={activeTab === "archived"}
          onEdit={handleEditTask}
          onArchive={handleArchiveTask}
          onRestore={handleRestoreTask}
        />
      ) : (
        <div className="text-center py-12 border rounded-lg bg-background">
          <h3 className="text-lg font-medium mb-2">
            {activeTab === "archived" ? "No archived tasks" : "No tasks found"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {activeTab === "archived" 
              ? "Tasks that you delete or cancel will appear here" 
              : "Get started by creating your first task"}
          </p>
          
          {activeTab === "my-tasks" && userRole !== "staff" && (
            <button
              onClick={() => setCreateTaskDialogOpen(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Task
            </button>
          )}
        </div>
      )}
      
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
