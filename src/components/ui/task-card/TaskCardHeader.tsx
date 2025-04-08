
import React from "react";
import {
  AlertTriangle,
  Bell,
  Clock,
  RepeatIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskPriority } from "@/types/task.types";
import { useTranslation } from "react-i18next";

interface TaskCardHeaderProps {
  title: string;
  priority: TaskPriority;
  isRecurring?: boolean;
  isCompleted: boolean;
}

export const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
  title,
  priority,
  isRecurring,
  isCompleted,
}) => {
  const { t } = useTranslation();
  
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
            "text-base font-medium line-clamp-2",
            isCompleted && "line-through text-muted-foreground"
          )}
        >
          {title}
        </h3>
        <div className="flex items-center mt-1 gap-2">
          <span className="flex items-center gap-1 text-xs">
            {getPriorityIcon()}
            <span className="capitalize">{t(`task.priority.${priority}`)}</span>
          </span>
          
          {isRecurring && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <RepeatIcon className="h-3 w-3" />
              <span>{t('recurring.makeRecurring')}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
