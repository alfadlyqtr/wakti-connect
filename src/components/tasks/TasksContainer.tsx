import React, { useState } from "react";
import { Task } from "@/types/task.types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { TaskGrid } from "@/components/tasks/TaskGrid";
import { useTaskOperations } from "@/hooks/tasks/useTaskOperations";

interface TasksContainerProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | "staff";
  refetch: () => Promise<void>;
  isPaidAccount: boolean;
  onCreateTask: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TasksContainer: React.FC<TasksContainerProps> = ({
  tasks,
  userRole,
  refetch,
  isPaidAccount,
  onCreateTask,
  onEdit,
  onDelete
}) => {
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const { completeTask, isProcessing } = useTaskOperations(userRole);
  
  // Filter tasks based on completion status
  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const handleCompleteTask = async (taskId: string) => {
    try {
      setPendingTaskId(taskId);
      await completeTask(taskId);
      await refetch();
    } catch (error) {
      console.error("Failed to complete task:", error);
    } finally {
      setPendingTaskId(null);
    }
  };
  
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg bg-muted/30">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground max-w-md">
            You don't have any {activeTab === 'completed' ? 'completed ' : ''}tasks yet.
            {activeTab !== 'completed' && (
              <>Create your first task to get started.</>
            )}
          </p>
          {activeTab !== 'completed' && (
            <Button onClick={onCreateTask} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <TaskGrid 
      tasks={activeTab === 'completed' ? completedTasks : activeTasks}
      onEdit={onEdit}
      onDelete={onDelete}
      onComplete={handleCompleteTask}
      isLoading={isProcessing}
      pendingTaskId={pendingTaskId}
      userRole={userRole}
      refetch={refetch}
    />
  );
};

export default TasksContainer;
