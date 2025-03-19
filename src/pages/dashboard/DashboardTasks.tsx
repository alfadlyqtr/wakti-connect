
import React, { useState } from "react";
import TaskControls from "@/components/tasks/TaskControls";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyTasksState } from "@/components/tasks/EmptyTasksState";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { SectionContainer } from "@/components/ui/section-container";
import { TaskGrid } from "@/components/tasks/TaskGrid";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { TaskFormData, TaskTab } from "@/types/task.types";
import { RecurringFormData } from "@/types/recurring.types";

const DashboardTasks = () => {
  const { user } = useAuth();
  const {
    tasks,
    isLoading,
    currentTab,
    setCurrentTab,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    searchQuery,
    setSearchQuery,
    createTask,
    userRole
  } = useTasks();
  
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Calculate whether the user has a paid account
  const isPaidAccount = userRole === "individual" || userRole === "business";
  
  // Handle creating a new task
  const handleCreateTask = async (
    taskData: TaskFormData, 
    recurringData?: RecurringFormData
  ) => {
    if (!user) return;
    
    try {
      // Check if this is a free account
      if (userRole === "free") {
        throw new Error("This feature is only available for paid accounts");
      }
      
      return await createTask(taskData, recurringData);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };
  
  return (
    <div className="w-full space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your tasks and to-do lists
        </p>
      </div>

      <SectionContainer>
        <TaskControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          filterPriority={filterPriority}
          onPriorityChange={setFilterPriority}
          onCreateTask={() => setIsCreateTaskOpen(true)}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isPaidAccount={isPaidAccount}
          userRole={userRole}
        />
      </SectionContainer>

      <SectionContainer>
        <Card>
          <CardContent className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : tasks && tasks.length > 0 ? (
              <TaskGrid 
                tasks={tasks} 
                showAssignee={currentTab === "shared-tasks" || currentTab === "assigned-tasks"} 
                type={currentTab}
              />
            ) : (
              <EmptyTasksState 
                onCreateTask={() => setIsCreateTaskOpen(true)} 
                type={currentTab} 
                isPaidAccount={isPaidAccount}
              />
            )}
          </CardContent>
        </Card>
      </SectionContainer>

      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        onCreateTask={handleCreateTask}
        userRole={userRole}
      />
    </div>
  );
};

export default DashboardTasks;
