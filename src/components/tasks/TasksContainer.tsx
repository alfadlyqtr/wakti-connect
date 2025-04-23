
import React, { useState } from "react";
import { Task } from "@/types/task.types";
import { UserRole } from "@/types/user";
import { TaskGrid } from "@/components/tasks/TaskGrid";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTaskOperations } from "@/hooks/tasks/useTaskOperations";

interface TasksContainerProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | "staff";
  refetch: () => Promise<void>;
  isPaidAccount: boolean;
  onCreateTask: () => void;
  isArchiveView?: boolean;
  onEdit: (task: Task) => void;
  onArchive: (taskId: string, reason: string) => void;
  onRestore: (taskId: string) => void;
}

const TasksContainer: React.FC<TasksContainerProps> = ({
  tasks,
  userRole,
  refetch,
  isPaidAccount,
  onCreateTask,
  isArchiveView = false,
  onEdit,
  onArchive,
  onRestore
}) => {
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const { completeTask, isProcessing } = useTaskOperations(userRole);
  
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
            {isArchiveView 
              ? "You don't have any archived tasks yet. When you archive tasks, they'll appear here."
              : "You don't have any active tasks yet. Create your first task to get started."}
          </p>
          
          {!isArchiveView && (
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
      tasks={tasks}
      onEdit={onEdit}
      onDelete={!isArchiveView ? (taskId) => onArchive(taskId, "deleted") : undefined}
      onComplete={!isArchiveView ? handleCompleteTask : undefined}
      onRestore={isArchiveView ? onRestore : undefined}
      isLoading={isProcessing}
      pendingTaskId={pendingTaskId}
      userRole={userRole}
      refetch={refetch}
      isArchiveView={isArchiveView}
    />
  );
};

export default TasksContainer;
