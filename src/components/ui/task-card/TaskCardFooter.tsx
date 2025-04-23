
import React from "react";
import { format } from "date-fns";
import { TaskStatus } from "@/types/task.types";
import { CheckCircle, CircleSlash } from "lucide-react";
 
interface TaskCardFooterProps {
  id?: string;
  status?: TaskStatus;
  completedDate?: Date | null;
  dueDate?: Date;
  onStatusChange?: (id: string, status: string) => void;
  onEdit?: (id: string) => void;
  subtaskCount?: number;
  completedSubtaskCount?: number;
  isCompleted: boolean;
}

export const TaskCardFooter: React.FC<TaskCardFooterProps> = ({
  id,
  status,
  completedDate,
  dueDate,
  onStatusChange,
  onEdit,
  subtaskCount = 0,
  completedSubtaskCount = 0,
  isCompleted
}) => {
  const handleMarkComplete = () => {
    if (id && onStatusChange) {
      onStatusChange(id, isCompleted ? "pending" : "completed");
    }
  };

  return (
    <div className="text-xs text-muted-foreground flex items-center justify-between">
      {subtaskCount > 0 && (
        <div>
          {completedSubtaskCount}/{subtaskCount} subtasks
        </div>
      )}
      
      {completedDate && (
        <div>
          Completed on {format(new Date(completedDate), "MMM d, yyyy")}
        </div>
      )}
      
      {onStatusChange && id && (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors ml-auto"
          onClick={handleMarkComplete}
        >
          {isCompleted ? <CircleSlash className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
          {isCompleted ? "Mark Pending" : "Mark Complete"}
        </button>
      )}
    </div>
  );
};
