
import React from "react";
import { format } from "date-fns";
import { TaskStatus } from "@/types/task.types";
import { CheckCircle, CircleSlash } from "lucide-react";
import { cn } from "@/lib/utils";
 
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
  onStatusChange,
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
    <div className={cn(
      "text-xs text-muted-foreground flex items-center justify-between",
      "transition-colors duration-200"
    )}>
      {subtaskCount > 0 && (
        <div className={cn(
          "px-2 py-0.5 rounded-full",
          "bg-muted/50 transition-colors duration-200",
          "group-hover:bg-muted"
        )}>
          {completedSubtaskCount}/{subtaskCount} subtasks
        </div>
      )}
      
      {completedDate && (
        <div className="text-muted-foreground/70">
          Completed on {format(new Date(completedDate), "MMM d, yyyy")}
        </div>
      )}
      
      {onStatusChange && id && (
        <button
          className={cn(
            "flex items-center gap-1 transition-colors duration-200",
            "hover:text-foreground ml-auto",
            "group-hover:text-primary"
          )}
          onClick={handleMarkComplete}
        >
          {isCompleted ? (
            <CircleSlash className="h-3 w-3" />
          ) : (
            <CheckCircle className="h-3 w-3" />
          )}
          {isCompleted ? "Mark Pending" : "Mark Complete"}
        </button>
      )}
    </div>
  );
};
