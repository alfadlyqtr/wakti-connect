
import React from "react";
import {
  AlertTriangle,
  Bell,
  Clock,
  RepeatIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskPriority, TaskStatus } from "@/types/task.types";

interface TaskCardHeaderProps {
  title: string;
  priority: TaskPriority;
  status?: TaskStatus;
  isRecurring?: boolean;
  isCompleted: boolean;
  isArchived?: boolean;
}

export const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
  title,
  priority,
  isRecurring,
  isCompleted,
}) => {
  const getPriorityLabel = (priority: TaskPriority): string => {
    switch (priority) {
      case "urgent": return "Urgent";
      case "high": return "High";
      case "medium": return "Medium";
      case "normal": return "Normal";
      default: return "Normal";
    }
  };
  
  const getPriorityIcon = () => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "normal":
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <h3
          className={cn(
            "text-base font-medium line-clamp-2 transition-colors duration-200",
            isCompleted && "line-through text-muted-foreground/70"
          )}
        >
          {title}
        </h3>
        <div className="flex items-center mt-1 gap-2">
          <span className={cn(
            "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
            "bg-muted/50 transition-colors duration-200",
            "group-hover:bg-muted"
          )}>
            {getPriorityIcon()}
            <span className="capitalize">{getPriorityLabel(priority)}</span>
          </span>
          
          {isRecurring && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <RepeatIcon className="h-3 w-3" />
              <span>Recurring</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
