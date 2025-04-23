
import React from "react";
import { Task } from "@/types/task.types";
import { TaskGrid } from "./TaskGrid";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useDebouncedRefresh } from "@/hooks/useDebouncedRefresh";

interface TasksContainerProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  refetch: () => Promise<void>;
  isPaidAccount: boolean;
  onCreateTask: () => void;
  isArchiveView?: boolean;
  onEdit: (task: Task) => void;
  onArchive: (taskId: string, reason: "deleted" | "canceled") => Promise<void>;
  onRestore?: (taskId: string) => Promise<void>;
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
  // Use the debounced refresh hook to prevent UI freezing
  const { refresh: debouncedRefetch, isRefreshing } = useDebouncedRefresh(refetch);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">
          {isArchiveView ? 'No Archived Tasks' : 'No Tasks Found'}
        </h3>
        <p className="text-muted-foreground mb-6">
          {isArchiveView 
            ? 'You have no archived tasks at this time.'
            : 'You have no tasks at this time. Create a task to get started.'}
        </p>
        
        {!isArchiveView && (
          <Button 
            onClick={onCreateTask}
            disabled={isRefreshing}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        )}
      </div>
    );
  }

  return (
    <TaskGrid 
      tasks={tasks} 
      userRole={userRole} 
      refetch={debouncedRefetch}
      isArchiveView={isArchiveView}
      onEdit={onEdit}
      onDelete={taskId => onArchive(taskId, "deleted")}
      onRestore={onRestore}
    />
  );
};

export default TasksContainer;
