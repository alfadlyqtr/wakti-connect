
import React from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/types/task.types";
import { CheckIcon, PenIcon, CheckCircle2Icon } from "lucide-react";
import { format } from "date-fns";

interface TaskCardFooterProps {
  id: string;
  status: TaskStatus;
  completedDate?: Date | null;
  onStatusChange: (id: string, status: string) => void;
  onEdit: (id: string) => void;
}

export const TaskCardFooter: React.FC<TaskCardFooterProps> = ({
  id,
  status,
  completedDate,
  onStatusChange,
  onEdit
}) => {
  return (
    <CardFooter className="pt-2 pb-3">
      <div className="flex justify-between w-full">
        <div className="flex gap-1">
          {status !== "completed" ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusChange(id, "completed")}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
            >
              <CheckIcon className="h-4 w-4 mr-1" /> 
              Complete
            </Button>
          ) : (
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle2Icon className="h-4 w-4 mr-1 text-green-500" />
              Completed {completedDate && format(completedDate, 'MMM d')}
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(id)}
          className="text-muted-foreground"
        >
          <PenIcon className="h-4 w-4 mr-1" /> 
          Edit
        </Button>
      </div>
    </CardFooter>
  );
};
