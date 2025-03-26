
import React from "react";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/types/task.types";
import { Check, Edit2, Loader2, Play } from "lucide-react";
import { format } from "date-fns";

interface TaskCardFooterProps {
  id: string;
  status: TaskStatus;
  completedDate: Date | string | null;
  onStatusChange: (id: string, status: string) => void;
  onEdit: (id: string) => void;
}

export const TaskCardFooter: React.FC<TaskCardFooterProps> = ({
  id,
  status,
  completedDate,
  onStatusChange,
  onEdit,
}) => {
  return (
    <div className="px-4 py-3 bg-muted/40 flex items-center justify-between">
      {status === "completed" ? (
        <div className="text-xs text-muted-foreground">
          {completedDate ? (
            <>
              Completed on {format(new Date(completedDate), "MMM d, yyyy")}
            </>
          ) : (
            "Completed"
          )}
        </div>
      ) : (
        <div className="space-x-2">
          {status !== "completed" && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onStatusChange(id, "completed")}
            >
              <Check className="mr-1 h-4 w-4" />
              Complete
            </Button>
          )}
          
          {status !== "in-progress" && status !== "completed" && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onStatusChange(id, "in-progress")}
            >
              <Play className="mr-1 h-4 w-4" />
              Start
            </Button>
          )}
          
          {status === "in-progress" && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
              disabled
            >
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              In Progress
            </Button>
          )}
        </div>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8"
        onClick={() => onEdit(id)}
      >
        <Edit2 className="mr-1 h-4 w-4" />
        Edit
      </Button>
    </div>
  );
};
