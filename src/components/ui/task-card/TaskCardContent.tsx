
import React from "react";
import { TaskStatus, SubTask } from "@/types/task.types";

interface TaskCardContentProps {
  description?: string;
  status: TaskStatus;
  subtasks?: SubTask[];
  taskId: string;
  onSubtaskToggle?: (taskId: string, subtaskIndex: number, isCompleted: boolean) => void;
  refetch?: () => void;
}

export const TaskCardContent: React.FC<TaskCardContentProps> = ({
  description,
  status,
  subtasks = [],
  taskId,
  onSubtaskToggle,
  refetch
}) => {
  const isCompleted = status === 'completed';
  
  return (
    <div className="space-y-3">
      {description && (
        <p className={`text-sm ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
};
