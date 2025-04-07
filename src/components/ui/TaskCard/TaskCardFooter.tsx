
import React from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { TaskStatus } from "@/types/task.types";
import { CheckCircle, CircleSlash } from "lucide-react";
 
interface TaskCardFooterProps {
  id: string;
  status: TaskStatus;
  completedDate?: Date | null;
  dueDate: Date;
  onStatusChange: (id: string, status: string) => void;
  onEdit: (id: string) => void;
}

export const TaskCardFooter: React.FC<TaskCardFooterProps> = ({
  id,
  status,
  completedDate,
  dueDate,
  onStatusChange,
  onEdit
}) => {
  const { t, i18n } = useTranslation();
  
  const isCompleted = status === "completed";
  
  const handleMarkComplete = () => {
    onStatusChange(id, isCompleted ? "pending" : "completed");
  };

  return (
    <div className="px-4 py-2 border-t flex items-center justify-between text-xs text-muted-foreground">
      <div>
        {completedDate && (
          <span>
            {t("task.completedTime.at")} {format(new Date(completedDate), "MMM d, yyyy")}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={handleMarkComplete}
        >
          {isCompleted ? <CircleSlash className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
          {isCompleted ? t("task.status.markPending") : t("task.status.markCompleted")}
        </button>
      </div>
    </div>
  );
};
